require('dotenv').config()

const express = require('express')
const expressLayouts = require('express-ejs-layouts')
// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node')
const app = express()

app.use(expressLayouts)
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.use(express.static(__dirname + '/public'))
const bodyParser = require('body-parser')
// 2. let know your app you will be using it
app.use(bodyParser.urlencoded({ extended: true }))

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: 'http://localhost:3000'
  })
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error))
// Our routes go here:
app.get("/", (req,res) => {
    res.render("home")
})

app.get("/artist-search", async (req,res) => {
try {
    const artist = await spotifyApi.searchArtists("Adele")
    console.log(artist.body.artists.items)
    res.render("artist-search-results", {artist})
} catch (error) {
    console.log(error)
}
   
})



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'))
