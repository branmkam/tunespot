import * as gl from './globals';
import React, { useState, useEffect } from "react";
import axios from 'axios';
import switchTabs from './switchTabs';
import { initGame, id } from './Game';

export default function Search()
{
    //works
    async function getSpotifyToken()  
    {
        const result = await axios({
            method : 'post',
            url : 'https://accounts.spotify.com/api/token',
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded', 
                'Authorization' : 'Basic ' + btoa(gl.sp_id + ':' + gl.sp_secret),
            },
            data: 'grant_type=client_credentials',
        });
        console.log('new token');
        window.sp_token = result.data.access_token;
    }

    //init
    if(!window.sp_token)
    {
        getSpotifyToken();
    }

    //updates token every 59.5 minutes
    setTimeout(getSpotifyToken, 1000*60*59.5);

    async function getPlaylists() 
    {
        let text = id('playlistsearch').value;
        if(text)
        {
            const result = await axios({
                method : 'get',
                url : 'https://api.spotify.com/v1/search',
                params: {
                    q : text,
                    type: 'playlist',
                    limit: 24,
                    offset: 0
                },
                headers: {
                    authorization : `Bearer ${window.sp_token}`,
                }
            });
            let results = result.data.playlists.items;
            results[0] == undefined ? id('displayResults').innerHTML = `<p>Your query returned no playlist results. Try a different one!</p>` : displayPlaylists(results);
        }
        
        else
        {  
            id('displayResults').innerHTML = `<p>Your query returned no playlist results. Try a different one!</p>`;
        }
    }

    async function getPlaylistById()
    {
        let text = id('playlistsearch').value;
        if(text)
        {
            try {
                const result = await axios({
                    method : 'get',
                    url : `https://api.spotify.com/v1/playlists/${text.split('/').pop()}`,
                    headers: {
                        authorization : `Bearer ${window.sp_token}`,
                    },
                });
                choosePlaylist(result.data);
            } catch (e) {
                id('displayResults').innerHTML = `<p>Not a valid playlist URL or ID! Make sure it's correct!</p>`;
            }
        }
        else
        {
            id('displayResults').innerHTML = `<p>No playlists found! Make sure your URL/ID is correct!</p>`;
        }
    }

    async function getUserPlaylists()
    {
        let text = id('playlistsearch').value;
        if(text)
        {
            try {
                //get rid of ?si if there
                let split = text.split('/').pop();
                split = split.includes('?') ? split.split('?')[0] : split;
                const result = await axios({
                    method : 'get',
                    url : `https://api.spotify.com/v1/users/${split}/playlists`,
                    headers: {
                        authorization : `Bearer ${window.sp_token}`,
                    },
                    params : {
                        limit: 24,
                    }
                });
                console.log(result.data.items.length);
                result.data.items.length <= 0 ? id('displayResults').innerHTML = `<p>This user has no playlists.</p>` : displayPlaylists(result.data.items);
            } catch (e) {
                id('displayResults').innerHTML = `<p>Not a valid user URL or ID! Make sure your URL/ID is correct!</p>`;
            }
        }
        else
        {
            id('displayResults').innerHTML = `<p>No users found! Make sure your URL is correct!</p>`;
        }
    }


    function displayPlaylists(results)
    {
        let display = id('displayResults');
        display.innerHTML = '';
        results.forEach(r => {
            let thisDiv = document.createElement('div');
            thisDiv.className = 'spotifyresultdiv column is-one-third content';
            display.appendChild(thisDiv);
            let thisIFrame = document.createElement('iframe');
            thisIFrame.className = 'spotifyresult';
            thisIFrame.src = `https://open.spotify.com/embed/playlist/${r.id}`;
            thisIFrame.frameborder = 0;
            thisDiv.appendChild(thisIFrame);
            let thisButton = document.createElement('button');
            thisButton.innerHTML = 'Choose';
            thisButton.className = 'playlistbutton';
            thisButton.addEventListener('click', choosePlaylist.bind(this, r), true);
            thisDiv.appendChild(thisButton);
            }
        );
    }


    //ONCE PLAYLIST CHOSEN
    async function choosePlaylist(r, event) {
        switchTabs(event, 'play');
        window.cp = r;
        initGame();
    }

    //return
    return(
        <div id="searchAPIs">
            <div id="searchbars">
                <input id='playlistsearch' placeholder="Search Query, Playlist URL/ID, or User URL/ID"/>
                <br/>
                <button id = 'getplaylist' onClick={getPlaylists}>Get Playlists with Query</button>
                <button id = 'getplaylistid' onClick={getPlaylistById}>Get Playlist by URL/ID</button>
                <button id = 'getplaylistuser' onClick={getUserPlaylists}>Get User Playlists by URL/ID</button>
                {/* <button id = 'getIPgeolocation' onClick={gl.getGeolocation}>Get Geolocation</button>    */}
            </div>
            <div id = 'displayResults' class = 'columns is-multiline'>
            </div>
        </div>
    )
}