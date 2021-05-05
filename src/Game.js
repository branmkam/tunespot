import { newElement } from './globals';
import axios from 'axios';
import * as gl from './globals';
import $ from 'jquery';
import { fireAuth, fireDb } from './firebase';
import React, {useState, useEffect} from 'react';

export default function Game()
{
    return(
        <div id='game'>
            <p>No playlist selected!</p>
        </div>
    )
}




let highscore, oldStats, oldHighscores = '';

export let initGame = async function()
{
    window.hasGame = false;
    window.clickTime = '';
    window.numButtons = 6;
    window.score = 0;
    window.buttons = [];
    let cp = window.cp;
    let game = id('game');
    const tracks = await axios({
        method : 'get',
        url : window.cp.tracks.href,
        headers: {
            authorization : `Bearer ${window.sp_token}`,
        }
    });
    window.tracklist = tracks.data.items.sort(() => Math.random() - 0.5);
    window.fullTracklist = [...window.tracklist];
    game.innerHTML = '';
    //set game elements
    let gamebox = newElement(game, 'div', 'box', 'gamebox');
    let title = newElement(gamebox, 'h1', 'title is-3', 'gametitle', cp.name);
    let trackNum = newElement(gamebox, 'h2', 'subtitle is-5', 'gametracknum', `${window.tracklist.length} tracks | by ${cp.owner.display_name}`);
    let subtitle = newElement(gamebox, 'h2', 'subtitle is-6', 'gamesubtitle',  `${cp.description}`);
    let startbutton = newElement(gamebox, 'button', 'startbutton', 'startbutton', 'Start!');
    let viewHSbutton = newElement(gamebox, 'button', 'hsbutton', 'hsbutton', 'View High Scores');
    startbutton.addEventListener('click', pressStart.bind(this));
    viewHSbutton.addEventListener('click', viewHS.bind(this));


    //do all async firebase calls here
    highscore = await fireDb.ref(`playlists/${window.cp.tracks.href.split('/')[window.cp.tracks.href.split('/').length-2]}/highscores/${fireAuth.currentUser.uid}`).get().then(snapshot => snapshot.val()); 
    oldStats = await fireDb.ref(`users/${fireAuth.currentUser.uid}`).get().then(snapshot => snapshot.val());
    
}

async function viewHS()
{
    let gamebox = id('gamebox');
    let rank = -1;
    let oldHighscores = await fireDb.ref(`playlists/${window.cp.tracks.href.split('/')[window.cp.tracks.href.split('/').length-2]}/highscores/`).get().then(snapshot => snapshot.val()); 
    if(oldHighscores)
    {
        console.log(oldHighscores);
        oldHighscores = Object.entries(oldHighscores);
        oldHighscores = oldHighscores.sort((a, b) => b[1] - a[1]);
        rank = oldHighscores.findIndex(ind => ind[0] == fireAuth.currentUser.uid) + 1;
    }
    let users = await fireDb.ref(`users/`).get().then(snapshot => snapshot.val()); 
    gamebox.removeChild(id('startbutton'));
    gamebox.removeChild(id('hsbutton'));
    newElement(gamebox, 'p', 'hsp', 'hsp');
    id('hsp').innerHTML = rank > 0 ? `<p>You rank #${rank} out of ${oldHighscores.length}.</p><br/>`: '';
    id('hsp').innerHTML += 
    `<h1 class="title is-4">Current High Scores</h1>` +
    (oldHighscores ? 
    oldHighscores.slice(0, 5)
    .map(s => `<p>${(fireAuth.currentUser.uid == s[0] ? 'YOU' : (`${users[s[0]].username} #${s[0].substring(s[0].length-4)}`))}: ${s[1]}</p>`).join('') 
    + `<br/><p>${oldHighscores.length} users have played this playlist.</p>` 
    : 'No high scores yet!');

    let back = newElement(gamebox, 'button', 'hsback', 'hsback', 'Back');
    back.addEventListener('click', hsback.bind(this));

}

function hsback()
{
    let gamebox = id('gamebox');
    gamebox.removeChild(id('hsp'));
    gamebox.removeChild(id('hsback'));
    let startbutton = newElement(gamebox, 'button', 'startbutton', 'startbutton', 'Start!');
    let viewHSbutton = newElement(gamebox, 'button', 'hsbutton', 'hsbutton', 'View High Scores');
    startbutton.addEventListener('click', pressStart.bind(this));
    viewHSbutton.addEventListener('click', viewHS.bind(this));

}

function pressStart()
{
    window.hasGame = true;
    let tracklist = window.tracklist;
    let game = id('game');
    let gamebox = id('gamebox');
    gamebox.removeChild(id('startbutton'));
    gamebox.removeChild(id('hsbutton'));
    let timeContainer = newElement(gamebox, 'div', null, 'timecontainer');
    let score = newElement(timeContainer, 'span', null, 'score', `Score: ${window.score} | ${tracklist.length} tracks left`);
    let time = newElement(timeContainer, 'span', 'timearea', 'timearea', '1000');
    let msg = newElement(gamebox, 'p', null, 'msg');
    let playerDiv = newElement(gamebox, 'div', null, 'playerDiv');
    let player = newElement(playerDiv, 'div', null, 'gameplayer');
    playerDiv.addEventListener('click', clickTime);
    let notWorking = newElement(gamebox, 'button', null, 'notWorking', "Not working or don't know? Skip the song.");
    notWorking.addEventListener('click', skipSong.bind(this));
    let choices = newElement(gamebox, 'div', 'choices columns is-multiline', 'gamechoices');
    gamebox.removeChild(id('gamesubtitle'));
    buttonResults();
}


//tracklist[0] always current track;
async function buttonResults()
{
    if(window.tracklist.length > 0)
    {
        id('timearea').innerHTML = '1000';
    }
    window.roundScore = 1000;
    window.clickTime = 0;
    window.buttons = [];
    //create buttons
    id('gamechoices').innerHTML = '';
    Array.from(Array(window.fullTracklist.length < window.numButtons ? window.fullTracklist.length : window.numButtons).keys()).forEach(a => {
        let choice = newElement(id('gamechoices'), 'div', 'choice column is-half', `choice${a}`);
        let cButton = newElement(choice, 'button', 'choicebutton', `choicebutton${a}`);
        window.buttons.push(cButton);
    });
    let fullTracklist = window.fullTracklist;
    if(window.tracklist.length > 0)
    {
        //gets correct track
        let correctTrack =  window.tracklist.shift();
        id('gameplayer').innerHTML = `<iframe id='currentplayer' src="https://open.spotify.com/embed/track/${correctTrack.track.id}" allowtransparency="true" allow="encrypted-media" onClick='${clickTime}'></iframe>`;
        // $("#gameplayer").load(function(){
        //     $(this).contents().on("mousedown, mouseup, click", function(){
        //         alert("Click detected inside iframe.");
        //     });
        // });
        // id('gameplayer').focus();
        // let listener = window.addEventListener('blur', function() {
        //     if (document.activeElement === document.getElementById('gameplayer')) {
        //         console.log('iframe active');
        //         clickTime();
        //     }
        //     window.removeEventListener('blur', listener);
        // });
        if(window.hasGame)
        {
            let monitor = setInterval(function(){
                let elem = document.activeElement;
                if(elem && elem.id == 'currentplayer'){
                    window.clickTimer = setTimeout(clickTime, 2000);
                    clearInterval(monitor);
                }
            }, 100);
        }
        

        //gets other tracks w/o correct
        let buttonTracks = [correctTrack, 
            ...fullTracklist
            .filter(f => f != correctTrack)
            .sort(() => Math.random() - 0.5)
            .slice(0, window.fullTracklist.length < window.numButtons ? window.fullTracklist.length - 1: window.numButtons - 1)
        ];
        
        //shuffles for button order
        buttonTracks = buttonTracks.sort(() => Math.random() - 0.5);

        //get correctIndex
        let correctIndex = buttonTracks.findIndex(ind => ind == correctTrack);

        for(let i = 0; i < window.buttons.length; i++)
        {
            let button = window.buttons[i];
            let t = buttonTracks[i];
            button.innerHTML = `${t.track.name}<br/>(${t.track.artists.map(a => a.name).join(', ')})`;
        }

        //update
        window.buttons.forEach(b => {
            b.id == `choicebutton${correctIndex}` ? b.addEventListener('click', correctPress.bind(this, correctTrack), {once : true}) 
            : b.addEventListener('click', incorrectPress.bind(this, correctTrack), {once : true});
        })
    }
    else
    {
        //endgame
        //check if existing score and if higher        
        if(!highscore || window.score > highscore)
        {
            //playlist high score rankings
            fireDb.ref(`playlists/${window.cp.tracks.href.split('/')[window.cp.tracks.href.split('/').length-2]}/highscores`).update(
                {
                    [`${fireAuth.currentUser.uid}`]: window.score,
                }
            )
            //playlist high score time achieved
            fireDb.ref(`playlists/${window.cp.tracks.href.split('/')[window.cp.tracks.href.split('/').length-2]}/timestamps`).update(
                {
                    [`${fireAuth.currentUser.uid}`]: new Date(),
                }
            )
            //TODO user profile - still NOT WORKING
            fireDb.ref(`users/${fireAuth.currentUser.uid}/scores`).update(
                {
                    [`${window.cp.tracks.href.split('/')[window.cp.tracks.href.split('/').length-2]}`]: window.score,
                }
            )             
        }
        else
        {
            //score lower than user's highscore
        }

        //end game
        let gamebox = id('gamebox');
        gamebox.innerHTML = 
        `<p>Finished with score of ${window.score}</p>
        <p>Your previous high score: ${highscore ? highscore : 'n/a'}</p><br/><h1 class = "title is-4">Current Highscores</h1>`;

        let rank = -1;
        let oldHighscores = await fireDb.ref(`playlists/${window.cp.tracks.href.split('/')[window.cp.tracks.href.split('/').length-2]}/highscores/`).get().then(snapshot => snapshot.val()); 
        if(oldHighscores)
        {
            oldHighscores = Object.entries(oldHighscores);
            oldHighscores = oldHighscores.sort((a, b) => b[1] - a[1]);
            rank = oldHighscores.findIndex(ind => ind[0] == fireAuth.currentUser.uid) + 1;
        }
        let users = await fireDb.ref(`users/`).get().then(snapshot => snapshot.val()); 
        newElement(gamebox, 'p', 'hsp', 'hsp');
        id('hsp').innerHTML = rank >= 0 ? `<p>You rank #${rank} out of ${oldHighscores.length}.</p><br/>`: '';
        id('hsp').innerHTML += 
        (oldHighscores ? 
        oldHighscores.slice(0, 5)
        .map(s => `<p>${(fireAuth.currentUser.uid == s[0] ? 'YOU' : (`${users[s[0]].username} #${s[0].substring(s[0].length-4)}`))}: ${s[1]}</p>`).join('') 
        + `<br/><p>${oldHighscores.length} users have played this playlist.</p>` 
        : 'No high scores yet!');
        let boton = newElement(gamebox, 'button', 'tryagain', 'tryagain', 'Try Again!');
        boton.addEventListener('click', () => {
            id('game').removeChild(gamebox);
            initGame();
        });
    }
}

function correctPress(t)
{
    if(window.hasGame && window.tracklist.length <= 0)
    {
        window.hasGame = false;
    }
    clearTimeout(window.clickTimer);
    let tracklist = window.tracklist;
    let oldScore = window.score;
    window.score += window.roundScore;
    id('score').innerHTML = `Score: ${window.score} | ${tracklist.length} tracks left`;
    id('msg').innerHTML = `Nice work! It was ${t.track.name} by ${t.track.artists[0].name}</br>+${window.roundScore}`;
    id('msg').className = 'correct';
    //console.log('called correct');
    //b.removeEventListener('click', correctPress.bind(this, b, t), {once : true}); 
    buttonResults();
}

function incorrectPress(t)
{
    if(window.hasGame && window.tracklist.length <= 0)
    {
        window.hasGame = false;
    }
    clearTimeout(window.clickTimer);
    let tracklist = window.tracklist;
    let oldScore = window.score;
    id('score').innerHTML = `Score: ${window.score} | ${tracklist.length} tracks left`;
    id('msg').innerHTML = `Nope! It was ${t.track.name} by ${t.track.artists[0].name}<br/>+0`;
    id('msg').className = 'incorrect';
    //console.log('called incorrect');
    //b.removeEventListener('click', incorrectPress.bind(this, b, t), {once : true}); 
    buttonResults();
}

function skipSong()
{    
    if(window.hasGame && window.tracklist.length <= 0)
    {
        window.hasGame = false;
    }
    clearTimeout(window.clickTimer);
    id('score').innerHTML = `Score: ${window.score} | ${window.tracklist.length} tracks left`;
    buttonResults();
}

//when player clicked - start time
function clickTime()
{
    if(window.clickTime == 0)
    {
        window.clickTime = new Date();
    }
    let timeTracker = function(){
        if(window.hasGame) 
        {
            let timeTaken = window.clickTime == 0 ? 0 : new Date() - window.clickTime;
            window.roundScore = Math.floor(1000*(0.5**(timeTaken/8000))); //half points every 8 seconds after 2 second delay
            id('timearea').innerHTML = window.roundScore;
            id('timearea').style.color = rgbify(window.roundScore);
        }
    };
    setInterval(timeTracker, 100); //updates 10 times a second
}

function rgbify(n)
{
    let r, g = 255; 
    if(n > 500)
    {
        r = Math.floor(255 - ((n-500)/2));
        g = 255;
    }
    else
    {
        g = Math.floor(255 + ((n-500)/2));
        r = 255;
    }
    let fin = '#' + (r > 16 ? r.toString(16) : '0' + r.toString(16)) + (g > 16 ? g.toString(16) : '0' + g.toString(16)) + "00";
    return fin;
}

export function id(string) {
    return document.getElementById(string);
}