import {fireDb, fireAuth} from './firebase';
import React, {useState, useEffect} from 'react';
import axios from 'axios';

function User()
{
    const [userFacts, setUserFacts] = useState({});

    useEffect(() => {
        async function fetchInfo() {
            const result = await fireDb.ref(`users/${fireAuth.currentUser.uid}`).get().then(snapshot => snapshot.val());
            setUserFacts(result);
        }
        fetchInfo();
    }, []);


    return(
        <div id='userstats'>
            <p>About {fireAuth.currentUser.displayName}</p>
            <p>Email: {fireAuth.currentUser.email}</p>
            <p>Playlists attempted: {userFacts.attempted.length}</p>
            <p>Date joined: {function() {
                let j = new Date(fireAuth.currentUser.metadata.creationTime);
                return j.toLocaleString(window.lang,{month:'short', day:'numeric', year:'numeric'});
            }()}</p>
            <p>Country: <img alt = {'flag-' + userFacts.country} src={`https://flagcdn.com/h24/${userFacts.country}.png`}/></p>
        </div>
    )
}


async function getCountryFlag()
{
    let t = await fireDb.ref(`users/${fireAuth.currentUser.uid}/country`).get().then(snapshot => snapshot.val());
    return t;
}

export default User;
