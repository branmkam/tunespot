import './App.css';
import Header from './Header.js';
import Game, { id } from './Game';
import * as gl from './globals';
import axios from 'axios';
import React, {useState, useEffect} from 'react';
import { fireDb, fireAuth } from './firebase.js';
import ReactDOM from 'react-dom';
import App from './App';

function Login() {  

    const [countries, setCountries] = useState({});

    useEffect(() => {
        async function fetchInfo() {
            const result = await axios({
                method : 'get',
                url : `https://flagcdn.com/${window.lang}/codes.json`, //languages supported are en, es, fr, de, it, cs, sk, pl
            });
            setCountries(result.data);
            console.log(result.data);
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
                        <input id = 'loginpassword' type="text" placeholder="Password"/>
                        <br/>
                        <p id = 'loginmsg'></p>
                        <br/>
                        <button id="loginbutton" class="loginbuttons" onClick={checkValidLogin}>Log In</button>
                    </div>
                    <div id="signupcol" class="column is-half">
                        <h1 class = 'title is-2'>Signup</h1>
                        <h1 class = 'subtitle is-5 is-italic'>for new users</h1>
                        <input id = 'signupusername' type="text" placeholder="Username"/>
                        <br/>
                        <input id = 'signuppassword' type="text" placeholder="Password"/>
                        <br/>
                        <input id = 'signupemail' type="email" placeholder="Email Address"/>
                        <br/>
                        <p id="signupmsg"></p>
                        <br/>
                        <p>Where are you from?</p>
                        <span id= "countryspan">
                            <select id="countryselect" onChange={changeCountryCode}>
                                <option selected disabled="true">Select country/territory...</option>
                                {
                                Object.keys(countries)
                                .filter(key => key.length == 2 && !['un', 'eu'].includes(key))
                                .map(key => countries[key])
                                .sort()
                                .map(c => <option>{c}</option>)
                                }
                            </select>
                            <br/>
                        </span>
                        <button id="signupbutton" class="loginbuttons" onClick={checkValidSignup}>Sign Up</button>
                    </div>
                </div>
            </section>
        </div>
    );

    async function checkValidLogin() {
        if(id('loginemail').value && id('loginpassword').value)
        {
            id('loginmsg').innerHTML = ("Success!");      
            fireAuth
            .signInWithEmailAndPassword(
                id('loginemail').value,
                id('loginpassword').value,
            )
            .then((auth) => {
                if (auth) {
                    //navigate to app homescreen
                    ReactDOM.render(
                        <React.StrictMode>
                          <App />
                        </React.StrictMode>,
                        id('root')
                      );
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
        if(to.username && to.password && to.email && e.options[e.selectedIndex].text != 'Select country/territory...')
        {
            if(to.username.length <= 15)
            {
                id('signupmsg').innerHTML = 'Account successfully created! Now login with your email/password.';
                fireAuth
                .createUserWithEmailAndPassword(to.email, to.password)
                .then((auth) => {
                    if (auth) {
                        auth.user.updateProfile({
                            displayName: to.username,
                        });
                        fireDb.ref("users/" + auth.user.uid).set({
                            username : to.username,
                            country : Object.keys(countries).find(key => countries[key] === e.options[e.selectedIndex].text),
                        });
                    }
                })
                .catch((err) => id('signupmsg').innerHTML = err.message);
                console.log(fireAuth.currentUser);
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

    async function changeCountryCode(){
        let e = document.getElementById('countryselect');
        let code = Object.keys(countries).find(key => countries[key] === e.options[e.selectedIndex].text);
        if(document.getElementById('flagimg')){ document.getElementById('countryspan').removeChild(document.getElementById('flagimg')) }
        let imgNew = gl.newElementBefore(document.getElementById('countryspan'), document.getElementById('countryselect'), 'img', null, 'flagimg');
        imgNew.src = `https://flagcdn.com/h24/${code}.png`;
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