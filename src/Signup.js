import './App.css';
import Header from './Header.js';
import Search from './Search';
import Game from './Game';
import switchTabs from './switchTabs';
import * as gl from './globals';

function Signup() {

    return (
        <div>
            <section id = "top" class = "hero is-small is-success">
                <div class = "hero-body">
                    <Header />
                </div>
            </section>
            <section id="app-body" class = "section">
                <div id="loginbox">
                    <h1 class = 'title is-2'>Login</h1>
                    <input type="text" placeholder="Username"/>
                    <br/>
                    <input type="text" placeholder="Password"/>
                    <br/>
                    <input type="email" placeholder="Email"/>
                    <br/>
                    <button id="loginbutton" class="loginbuttons">Log In</button>
                    <button id="signuplink" class="loginbuttons">New to TuneSpot? Sign Up here!</button>
                </div>
            </section>
        </div>
    );
}

export default Signup;