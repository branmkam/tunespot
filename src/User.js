import {fireDb, fireAuth} from './firebase';
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';
import { id } from './Game';
import { returnToLogin } from './SignOut';

function User()
{
    let deleted = false;
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
        window.timeout = ''; 
        if(id('deleteaccount').innerHTML == 'Are you sure?')
        {
            deleted = true;
            clearTimeout(window.timeout);
            clearTimeout(renderAgainf);
            //delete everything about user from database

            if(userFacts.scores)
            {
                //delete playlist scores
                Object.keys(userFacts.scores).forEach(key => {
                    fireDb.ref(`playlists/${key}/highscores`).update(
                        {
                            [`${fireAuth.currentUser.uid}`]: null,
                        }
                    );
                    fireDb.ref(`playlists/${key}/timestamps`).update(
                        {
                            [`${fireAuth.currentUser.uid}`]: null,
                        }
                    );
                });
            }

            //delete user info from firebase
            fireDb.ref(`users/`).update(
                {
                    [`${fireAuth.currentUser.uid}`]: null,
                }
            );

            //delete user from auth firebase
            fireAuth.currentUser.delete().catch(function(error) {
                console.log(error)
                });
            
            //render sad sorry message :(
            ReactDOM.render(
                <div id="deletemsg">
                    <h1 class="title is-2">We're sorry to see you go.</h1>
                    <p>Please join the Tunespot community again soon!</p>
                    <button class="loginbuttons" style={{width:'200px'}} onClick={returnToLogin}>Return to Signup Screen</button>
                </div>,
                id('root')
            );
        }
        else
        {
            id('deleteaccount').innerHTML = 'Are you sure?';
            //revert in 5 sec if not deleted
            if(!deleted)
            {
                window.timeout = setTimeout(reset, 5000)
            };
        }
    }

    function reset() 
    {
        if(!deleted)
        {
            id('deleteaccount').innerHTML = 'Delete Account';
            clearTimeout(window.timeout);
            window.timeout = '';
        }
    }
    async function renderAgain() {
        if(!deleted)
        {
            const result = await fireDb.ref(`users/${fireAuth.currentUser.uid}`).get().then(snapshot => snapshot.val());
            setUserFacts(result);
            setLastUpdated(new Date());
            //ReactDOM.render(<DisplayData/>, document.getElementById('usercontainer'));
        }
    }

    let renderAgainf = setTimeout(renderAgain, 60000); //once a minute

    return <div id='usercontainer'><DisplayData/></div>;
}

export default User;
