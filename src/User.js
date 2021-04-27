import {fireDb, fireAuth} from './firebase';
import React, {useState, useEffect} from 'react';
import axios from 'axios';

function User()
{
    return(
        <div id='userstats'>
            <p>About {fireAuth.currentUser.displayName}</p>
            <p>Playlists attempted: </p>
            <p>Date joined: </p>
            <p>Country: <img src={`https://flagcdn.com/h24/${getCountryFlag()}.png`}/></p>
        </div>
    )
}


async function getCountryFlag()
{
    let t = await fireDb.ref(`users/${fireAuth.currentUser.uid}/country`).get().then(snapshot => snapshot.val());
    return t;
}

export default User;
