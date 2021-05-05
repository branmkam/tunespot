import React from "react";
import ReactDOM from "react-dom";
import Login from "./Login";

function SignOut()
{
       
    return(
        <div id="signoutdiv">
            <p class="title is-2">Are you sure?</p>
            <button onClick = {returnToLogin}>Return to Login</button>
        </div>
    )
}

export function returnToLogin()
{
    ReactDOM.render(
        <React.StrictMode>
        <Login />
        </React.StrictMode>,
        document.getElementById('root')
    );
}

export default SignOut;