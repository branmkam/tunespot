import {fireDb, fireAuth} from './firebase';
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';
import { id } from './Game';

function User()
{
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [userFacts, setUserFacts] = useState({});

    useEffect(() => {
        async function fetchInfo() {
            const result = await fireDb.ref(`users/${fireAuth.currentUser.uid}`).get().then(snapshot => snapshot.val());
            setUserFacts(result);
        }
        fetchInfo();
    }, []);

    function DisplayData()
    {
        return( 
                <div id = 'userstats'>
                    <h1 class="title is-5">About {fireAuth.currentUser.displayName}</h1>
                    <p>Email: {fireAuth.currentUser.email}</p>
                    <p>User ID: {fireAuth.currentUser.uid}</p>
                    <p>Date joined: {function() {
                        let j = new Date(fireAuth.currentUser.metadata.creationTime);
                        return j.toLocaleString(window.lang,{month:'short', day:'numeric', year:'numeric'});
                    }()}</p>
                    <p>Country: <img alt = {'flag-' + userFacts.country} src={`https://flagcdn.com/h24/${userFacts.country}.png`}/></p>
                    <p>Playlists played: {userFacts.scores ? Object.keys(userFacts.scores).length : 0}</p>
                    <p>Total Score: {userFacts.scores ? Object.values(userFacts.scores).reduce((acc, val) => {return acc + val}, 0) : 0}</p>
                    <p>Last Updated: {function() {
                        let j = new Date(lastUpdated);
                        return j.toLocaleString(window.lang,{month:'numeric', day:'numeric', year:'numeric', hour:'numeric', minute:'numeric'});
                    }()}</p>
                    <button id="deleteaccount" onClick={deleteAccount}>Delete Account</button>
                </div>
        )
    }


    
    function deleteAccount() {
        if(id('deleteaccount').innerHTML == 'Are you sure?')
        {
            //delete account here - use remove() at normal firebase endpoint
        }
        else
        {
            id('deleteaccount').innerHTML = 'Are you sure?';
        }
    }

    async function renderAgain() {
        const result = await fireDb.ref(`users/${fireAuth.currentUser.uid}`).get().then(snapshot => snapshot.val());
        setUserFacts(result);
        setLastUpdated(new Date());
        //ReactDOM.render(<DisplayData/>, document.getElementById('usercontainer'));
    }

    setTimeout(renderAgain, 60000); //once a minute

    return <div id='usercontainer'><DisplayData/></div>;
}

export default User;
