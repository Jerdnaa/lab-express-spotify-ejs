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
    const artistQuery = req.query.artistName
    // console.log(artistQuery)
try {
    const data = await spotifyApi.searchArtists(JSON.stringify(artistQuery))
    const artists = data.body.artists.items
    // console.log(artists)
    res.render("artist-search-results", { artists })
} catch (error) {
    console.log(error)
}
   
})

app.get("/albums/:artistId", async (req, res,) => {
    const { artistId } = req.params
    // console.log(artistId);
    try {
        const data = await spotifyApi.getArtistAlbums(artistId)
        const albums = data.body.items
        // console.log(albums);
        res.render("albums", {albums})
    } catch (error) {
        console.log(error)
    }
})

app.get("/tracks/:albumId", async (req, res) => {
    const { albumId } = req.params

    try {
        const data = await spotifyApi.getAlbumTracks(albumId)
        const tracks = data.body.items
        console.log(tracks);
        res.render("tracks", {tracks})
    } catch (error) {
        console.log(error)
    }
})



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'))


