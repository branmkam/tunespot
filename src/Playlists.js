import {fireDb, fireAuth} from './firebase';
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';
import { id } from './Game';
import choosePlaylist from './Search';

function Playlists()
{
    window.playlists = '';
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [userFacts, setUserFacts] = useState({});

    useEffect(() => {
        async function fetchInfo() {
            const result = await fireDb.ref(`users/${fireAuth.currentUser.uid}`).get().then(snapshot => snapshot.val());
            setUserFacts(result);
        }
        fetchInfo();
    }, []);



        //works
        async function getPlaylists()  
        {
            setLastUpdated(new Date());
            let arr = [];
            if(userFacts.scores)
            {
                console.log('has scores');
                let keys = Object.keys(userFacts.scores);
                console.log(keys);
                keys.forEach(async (key) => 
                    {
                        const result2 = await axios({
                            method : 'get',
                            url : `https://api.spotify.com/v1/playlists/${key}`,
                            headers: {
                                authorization : `Bearer ${window.sp_token}`,
                            },
                        });
                        arr.push([result2.data, userFacts.scores[key]]);
                        console.log(result2.data);
                        window.playlists = arr;
                    }
                );
            }
            console.log(window.playlists);
        }
    
        //init
        if(!window.playlists)
        {
            getPlaylists();
        }
    
        //updates playlists every 2 minutes
        setTimeout(getPlaylists, 120000);


    //set up table
    let playlistTable = window.playlists.map(p => {
        <tr><td><a id={`playlist${p[0].id}`}>{p[0].name}</a></td><td>{p[0].owner.display_name}</td><td>{p[0].tracks.items.length}</td><td>{p[1]}</td></tr>;
    });

    return(
        <div id="playlistsplayed">
        { window.playlists.length == 0 ? 'No playlists played yet!' :
            <table>
                <thead>
                    <tr><th>Name</th><th>Spotify User</th><th>Tracks</th><th>Your Score</th></tr>
                </thead>
                <tbody>
                    {playlistTable}
                </tbody>
            </table>
        }
        {
            //assign link id    
            //playlists.forEach(p => id(`playlist${p[0]}`).addEventListener('click', choosePlaylist.bind(this, p[0].id))) 
        }
        <br/>
        <p>Last Updated: {function() {
                        let j = new Date(lastUpdated);
                        return j.toLocaleString(window.lang,{month:'numeric', day:'numeric', year:'numeric', hour:'numeric', minute:'numeric'});
                }()}</p>
        </div>
    );
}

export default Playlists;