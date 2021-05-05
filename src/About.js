function About()
{
    return(
        <div id='aboutdiv'>
            <h1 class='title is-4'>Hey there! My name's Brandon, and thanks for playing my game!</h1>
            <h1 class = 'title is-5'>How to play</h1>
            <p>Search for a playlist with a query, the playlist URL/ID or find a user's playlists by user URL/ID.</p>
            <p>Once selected, you can begin playing by pressing the start button.</p>
            <p>You can get a maximum of 1000 points per song. The points start dropping down two seconds after you <b>first press play</b>, 
                leaving you two seconds to get a perfect score on each song.</p>
            <p>After that, the points drop exponentially, at a rate of half every 8 seconds. (So, 500 will be left after 10 seconds, 250 after 18, 125 after 26, etc.)</p>
            <p>Once you've played through all of the songs, you can see your rank against other users!</p>
            <br/>
            <h1 class = 'title is-5'>About the Dev and Game</h1>
            <p>I'm currently a sophomore at UNC-Chapel Hill studying CS and Linguistics. Check out my 
                website <a href="https://brandon-kaminski.tech" target="_blank">here</a>!</p>
            <p>I created TuneSpot in April-May 2021 for my web development course's final project, but I thought everyone around the world could enjoy it.
                Feel free to use it to challenge your friends, jog your memory, discover Spotify-curated playlists, or even study for music classes! 
                Crossing backseat name-that-tune with one of the most popular streaming platforms presents endless opportunities to find new music. 
                You don't even need a Spotify account to play TuneSpot!
            </p>
            <p>
                This site is built in react.js, and makes heavy use of the Spotify API. Authentication/data storage is handled through Firebase.
                I also used a country code API for the flag images, and a geolocation API to make a best guess of where you're from when you sign up.
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