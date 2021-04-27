function About()
{
    return(
        <div id='aboutdiv'>
            <h1 class='title is-4'>Hey there! My name's Brandon, and thanks for playing my game!</h1>
            <p>I'm currently a sophomore at UNC-Chapel Hill studying CS and Linguistics. Check out my website <a href="https://brandon-kaminski.tech" target="_blank">here</a>!</p>
            <p>I created TuneSpot in April 2021 for my web development course's final project, but I thought everyone around the world could enjoy it.
                Feel free to use it to challenge your friends, jog your memory, discover Spotify-curated playlists, or even study for music classes! 
                Crossing backseat name-that-tune with one of the most popular streaming platforms presents endless opportunities to find new music!
            </p>
            <p>
                This site is built in react.js, and makes heavy use of the Spotify API. I also used a country code API for the flag images, and a 
                geolocation API to make a best guess of where you're from when you sign up.
            </p>
            <p>
                Go set some high scores!
            </p>
            <p class = "is-italic has-text-link">
                -Brandon Kaminski
            </p>
        </div>
    )
}

export default About;