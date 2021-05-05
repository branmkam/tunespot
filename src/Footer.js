import React, {useEffect, useState} from 'react';
import { fireDb } from './firebase';

export default function Footer() {

    const [version, setVersion] = useState('');

    useEffect(() => {
        async function fetchInfo() {
            const result = await fireDb.ref(`version`).get().then(snapshot => snapshot.val());
            setVersion(result);
        }
        fetchInfo();
    }, []);

    return ( 
        <div id="footerdiv" class = "content has-text-centered">
            <span id="footerpara">version {version}</span>
        </div>
    );
  }
  