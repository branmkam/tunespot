import './App.css';
import Header from './Header.js';
import Search from './Search';
import Game from './Game';
import switchTabs from './switchTabs';
import {fireDb, fireAuth} from './firebase';
import User from './User.js';
import SignOut from './SignOut';

function App() {
  window.cp = {};
  //change in future
  window.lang = 'en';
  window.signOut = false;
  return (
    <div>
      <section id = "top" class = "hero is-small is-success">
        <div class = "hero-body">
          <Header />
        </div>
        <div class="hero-foot">
            <nav class="tabs is-centered">
              <ul>
                  <li id = 'searchTab' class = "tab is-active has-text-link" onClick={event => switchTabs(event, 'search')}><a>Playlist Search</a></li>
                  <li id = 'playTab' class = "tab" onClick={event => switchTabs(event, 'play')}><a>Play Game</a></li> 
                  <li id = 'userTab' class = "tab" onClick={event => switchTabs(event, 'user')}><a>About {fireAuth.currentUser.displayName}</a></li>
                  <li id = 'signOutTab' class = "tab" onClick={event => {switchTabs(event, 'signOut'); window.signOut = true;}}><a>Sign Out</a></li>
              </ul>
            </nav>
        </div>
      </section>

      <section id="app-body" class = "section">
        <div id="search" class="content-tab">
          <Search />
        </div>
        <div id="play" class="content-tab">
          <Game />
        </div>
        <div id="user" class="content-tab">
          <User />
        </div>
        <div id="signOut" class="content-tab">
          <SignOut />
        </div>
      </section>
    </div>
  );
}

export default App;