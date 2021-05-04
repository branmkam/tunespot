import {fireDb, fireAuth} from './firebase';
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';
import { id } from './Game';

function Playlists()
{
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [userFacts, setUserFacts] = useState({});
    const [playlists, setPlaylists] = useState([]);

    useEffect(() => {
        async function fetchInfo() {
            const result = await fireDb.ref(`users/${fireAuth.currentUser.uid}`).get().then(snapshot => snapshot.val());
            let arr = [];
            setUserFacts(result);
            console.log(result);
            if(userFacts.scores)
            {
                let keys = Object.keys(userFacts.scores);
                console.log(keys);
                keys.forEach(async (key) => 
                    {
                        const result = await axios({
                            method : 'get',
                            url : `https://api.spotify.com/v1/playlists/${key}`,
                            headers: {
                                authorization : `Bearer ${window.sp_token}`,
                            },
                        });
                        arr.push([result.data, userFacts.scores[key]]);
                        setPlaylists(arr);
                    }
                );
            }
            console.log(playlists);
        }
        fetchInfo();
    }, []);


    async function renderAgain() {
        const result = await fireDb.ref(`users/${fireAuth.currentUser.uid}`).get().then(snapshot => snapshot.val());
        setUserFacts(result);    
        if(userFacts.scores)
        {
            let keys = Object.keys(userFacts.scores);
            let arr = [];
            keys.forEach(async (key) => 
                {
                    const result = await axios({
                        method : 'get',
                        url : `https://api.spotify.com/v1/playlists/${key}`,
                        headers: {
                            authorization : `Bearer ${window.sp_token}`,
                        },
                    });
                    arr.push([result.data, userFacts.scores[key]]);
                }
            );
            console.log(arr);
            setPlaylists(arr);
        }
        setLastUpdated(new Date());
    }

    //setTimeout(renderAgain, 1000); //once a minute

    return(
        <div id="playlistsplayed">
        <table>
            <tbody>
            {
                playlists.length == 0 ? 'No playlists played yet!' : playlists.map(p => <tr><td>{p[0].name}</td><td>{p[0].owner.display_name}</td><td>{p[0].tracks.length}</td><td>{p[1]}</td></tr>)
            }
            </tbody>
        </table>
        </div>
    );
}

export default Playlists;