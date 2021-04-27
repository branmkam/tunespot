import { newElement } from './globals';
import axios from 'axios';
import * as gl from './globals';
import $ from 'jquery';

export default function Game()
{
    return(
        <div id='game'>
            <p>No playlist selected!</p>
        </div>
    )
}

export let initGame = async function()
{
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
    startbutton.addEventListener('click', pressStart.bind(this));
}

function pressStart()
{
    let tracklist = window.tracklist;
    let game = id('game');
    let gamebox = id('gamebox');
    gamebox.removeChild(id('startbutton'));
    let score = newElement(gamebox, 'p', null, 'score', `Score: ${window.score} | ${tracklist.length} tracks left`);
    let msg = newElement(gamebox, 'p', null, 'msg', ' <br/> ');
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
function buttonResults()
{
    window.clickTime = '';
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

        //gets other tracks w/o correct
        let buttonTracks = [correctTrack, ...fullTracklist.filter(f => f != correctTrack).sort(() => Math.random() - 0.5).slice(0, window.fullTracklist.length < window.numButtons ? window.fullTracklist.length - 1: window.numButtons - 1)];
        
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
        //end game
        id('gamebox').innerHTML = `Finished with score of ${window.score}`;
    }
}

function correctPress(t)
{
    let tracklist = window.tracklist;
    let oldScore = window.score;
    window.score += 100;
    id('score').innerHTML = `Score: ${window.score} | ${tracklist.length} tracks left`;
    id('msg').innerHTML = `Nice work! It was ${t.track.name} by ${t.track.artists[0].name}</br>+${window.score - oldScore}`;
    id('msg').className = 'correct';
    //console.log('called correct');
    //b.removeEventListener('click', correctPress.bind(this, b, t), {once : true}); 
    buttonResults();
}

function incorrectPress(t)
{
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
    id('score').innerHTML = `Score: ${window.score} | ${window.tracklist.length} tracks left`;
    buttonResults();
}

//when player clicked - start time
function clickTime(e)
{
    if(!window.clickTime)
    {
        window.clickTime = e.timeStamp;
    }
    console.log(new Date(window.clickTime));
}

export function id(string) {
    return document.getElementById(string);
}