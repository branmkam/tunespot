import './App.css';
import Header from './Header.js';
import Footer from './Footer.js';
import Game, { id } from './Game';
import * as gl from './globals';
import axios from 'axios';
import React, {useState, useEffect} from 'react';
import { fireDb, fireAuth } from './firebase.js';
import ReactDOM from 'react-dom';
import App from './App';

function Login() {  

    window.hasGame = false;
    const [countries, setCountries] = useState({});
    const [country, setCountry] = useState('');

    useEffect(() => {
        async function fetchInfo() {
            const result = await axios({
                method : 'get',
                url : `https://flagcdn.com/en/codes.json`, //languages supported are en, es, fr, de, it, cs, sk, pl
            });
            setCountries(result.data);
            const result2 = await gl.getGeolocation();
            window.codes = result.data;
            setCountry(result2.country_code.toLowerCase());
        }
        fetchInfo();
    }, []);

    return (
        <div>
            <section id = "top" class = "hero is-small is-success">
                <div class = "hero-body">
                    <Header />
                </div>
            </section>
            <section id="app-body" class = "section">
                <div id="loginbox" class="columns is-multiline">
                    <div id="logincol" class="column is-6">
                        <h1 class = 'title is-2'>Login</h1>
                        <h1 class = 'subtitle is-5 is-italic'>for returning users</h1>
                        <input id = 'loginemail' type="email" placeholder="Email"/>
                        <br/>
                        <input id = 'loginpassword' type="password" placeholder="Password"/>
                        <br/>
                        <p id = 'loginmsg'></p>
                        <br/>
                        <button id="loginbutton" class="loginbuttons" onClick={checkValidLogin}>Log In</button>
                        <br/>
                        <button class="notWorking" onClick={forgotPassword}>Forgot password?</button>
                    </div>
                    <div id="signupcol" class="column is-half">
                        <h1 class = 'title is-2'>Signup</h1>
                        <h1 class = 'subtitle is-5 is-italic'>for new users</h1>
                        <p><b>Notice:</b> Don't use a fake email. Firebase will ask you to verify any email you enter.</p>
                        <input id = 'signupemail' type="email" placeholder="Email"/>
                        <br/>
                        <input id = 'signuppassword' type="password" placeholder="Password"/>
                        <br/>
                        <input id = 'signupusername' type="text" placeholder="Username"/>
                        <br/>
                        <p id="signupmsg"></p>
                        <br/>
                        <p>Where are you from?</p>
                        <span id= "countryspan">
                            <img id = 'flagimg' 
                            alt = {`flag-${country}`} 
                            src={`https://flagcdn.com/h24/${country}.png`}/>
                            <select id="countryselect" onChange={changeCountryCode}>
                            {
                                Object.keys(countries)
                                .filter(key => key.length == 2 && !['un', 'eu', 'aq'].includes(key))
                                .map(key => countries[key])
                                .sort()
                                .map(c => <option selected={countries[country] == c}>{c}</option>)  
                            }
                            {
                                id('countryselect') != null ? id('countryselect').click() : ''
                            }
                            </select>
                            <br/>
                        </span>
                        <button id="signupbutton" class="loginbuttons" onClick={checkValidSignup}>Sign Up</button>
                    </div>
                </div>
            </section>
            <section>
                <Footer />
            </section>
        </div>
    );

    async function checkValidLogin() {
        if(id('loginemail').value && id('loginpassword').value)
        {      
            fireAuth
            .signInWithEmailAndPassword(
                id('loginemail').value,
                id('loginpassword').value,
            )
            .then((auth) => {
                if (auth && fireAuth.currentUser.emailVerified) {
                    id('loginmsg').innerHTML = "Success!";
                    //navigate to app homescreen
                    ReactDOM.render(
                        <React.StrictMode>
                          <App />
                        </React.StrictMode>,
                        id('root')
                      );
                      document.getElementById('searchTab').click();
                }
                else
                {
                    id('loginmsg').innerHTML = "Your email isn't verified! Verify it and try again.";
                }
            }).catch(err => id('loginmsg') != null ? id('loginmsg').innerHTML = err.message : '');
        }
        else
        {
            id('loginmsg').innerHTML = 'All fields must not be empty!';
        }
    }


    async function checkValidSignup() {
        let to = {
            username : id('signupusername').value,
            password : id('signuppassword').value,
            email : id('signupemail').value,
        }
        let e = id('countryselect');
        //non-empty
        if(to.username && to.password && to.email)
        {
            if(to.username.length <= 15 && to.username.length >= 5)
            {
                id('signupmsg').innerHTML = 'Account successfully created! Now verify your email, then login with your email/password.';
                fireAuth
                //create account
                .createUserWithEmailAndPassword(to.email, to.password)
                .then((auth) => {
                    if (auth) {
                        auth.user.updateProfile({
                            displayName: to.username,
                        });
                        fireDb.ref("users/" + auth.user.uid).set({
                            username : to.username,
                            email : to.email,
                            country : Object.keys(countries).find(key => countries[key] === e.options[e.selectedIndex].text),
                        });
                        //send verification email
                        fireAuth.useDeviceLanguage();
                        fireAuth.currentUser.sendEmailVerification().catch((err) => console.log(err)); //optional .then() in between if needed
                    }
                })
                .catch((err) => id('signupmsg').innerHTML = err.message);
                console.log(fireAuth.currentUser);
            }
            else if(to.username.length < 5)
            {
                id('signupmsg').innerHTML = 'Username can\'t be shorter than 5 characters.'
            }
            else
            {
                id('signupmsg').innerHTML = 'Username can\'t be longer than 15 characters.';
            }
        }
        else
        {
            id('signupmsg').innerHTML = 'All fields must not be empty!';
        } 
    }

    function changeCountryCode(){
        let e = document.getElementById('countryselect');
        let code = Object.keys(countries).find(key => countries[key] === e.options[e.selectedIndex].text);
        if(document.getElementById('flagimg')){ document.getElementById('countryspan').removeChild(document.getElementById('flagimg')) }
        let imgNew = gl.newElementBefore(document.getElementById('countryspan'), document.getElementById('countryselect'), 'img', null, 'flagimg');
        imgNew.src = `https://flagcdn.com/h24/${code}.png`;
    }

    function forgotPassword()
    {
        fireAuth.sendPasswordResetEmail(fireAuth.currentUser.email).then(function() {
            id('loginmsg').innerHTML = 'Password reset email sent.';
        }).catch(err => console.log(err));
    }
}


/*
AUTHENTICATION HERE
 try {
        fireAuth
        .signInWithEmailAndPassword(
            this.state.email,
            this.state.password
        )
        .then((auth) => {
            if (auth) {
            // there is a user so navigate to home screen
            // console.log("success");
            }
        });
    } catch (err) {
        //console.log(err.message);
    }
*/
export default Login;