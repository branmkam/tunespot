import {fireDb, fireAuth} from './firebase';
import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

function World()
{
    const [users, setUsers] = useState('');
    const [lastUpdated, setLastUpdated] = useState(new Date());


    useEffect(() => {
        async function fetchInfo() {
            const result = await fireDb.ref(`users`).get().then(snapshot => snapshot.val());
            setUsers(result);
            setLastUpdated(new Date());
        }
        fetchInfo();
    }, []);

    let countries = Object.entries(users).filter(u => users[u[0]].emailVerified).map(u => u[1].country);
    let tally = {};
    countries.forEach(c => 
    {
        if(c in tally)
        {
            tally[c] += 1;
        }
        else
        {
            tally[c] = 1;
        }
    });

    let tallyArray = Object.entries(tally).sort((a, b) => {return b[1] - a[1]});

    let table = 
        <table>
            <tbody>
            {
                tallyArray.map(t => 
                  <tr class={t[0] == users[fireAuth.currentUser.uid].country ? 'mine' : ''}><td><img src={`https://flagcdn.com/h120/${t[0]}.png`}/></td><td>{window.codes[Object.keys(window.codes).find(key => key == t[0])]}</td><td>{t[1]}</td></tr>  
                )
            }
            </tbody>
        </table>

    async function renderAgain() {
        const result = await fireDb.ref(`users`).get().then(snapshot => snapshot.val());
        setUsers(result);
        setLastUpdated(new Date());
    }

    setTimeout(renderAgain, 60000); //1 minute

    return(
        <div id = "worldstats" class="has-text-centered">
            <h1 class="title is-4">TuneSpot has {countries.length} user{countries.length == 1 ? '' : 's'} from {tallyArray.length} countr{tallyArray.length == 1 ? 'y' : 'ies'}!</h1>
            {table}
            <p>Last Updated: {function() {
                        let j = new Date(lastUpdated);
                        return j.toLocaleString(window.lang,{month:'numeric', day:'numeric', year:'numeric', hour:'numeric', minute:'numeric'});
                }()}
            </p>
        </div>
    )
}

export default World;