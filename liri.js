require('dotenv').config();
var fs = require('fs');
var keys = require('./keys.js');
var request = require('request');
var command = process.argv[2];
var input = process.argv;
var searchArr = input.slice(3);
var search = searchArr.join(' ');

switch (command) {
    case 'my-tweets':
        tweets();
        break;
    case 'spotify-this-song':
        spotifyThis(search);
        break;
    case 'movie-this':
        movie(search);
        break;
    case 'do-what-it-says':
        doIt();
        break;
}

function tweets() {
    var Twitter = require('twitter');
    var client = new Twitter(keys.twitter);

    client.get('statuses/user_timeline', {
        count: 20
    }, function (err, tweers, response) {
        if (!err) {
            var body = JSON.parse(response.body);
            // console.log(body);
            for (let i in body) {
                console.log('----------------' + '\n\n' + body[i].text + '\n' + body[i].created_at + '\n');
            }
        }
    })
}

function spotifyThis(search) {
    var Spotify = require('node-spotify-api');
    var spotify = new Spotify(keys.spotify);

    if (search === '') search = 'Heathens';

    spotify.search({
        type: 'track',
        query: search,
        limit: 1
    }, function (err, data) {
        if (!err) {
            console.log('\nSong Title: ' + data.tracks.items[0].name + '\n' + 'Artist: ' + data.tracks.items[0].artists[0].name + '\n' + 'Album: ' + data.tracks.items[0].album.name + '\n' + 'Preview: ' + data.tracks.items[0].preview_url + '\n');
        }
    })
}

function movie(search) {
    if (search === '') search = 'Mr. Nobody';
    request('http://www.omdbapi.com/?t=' + search +'&y=&plot=short&apikey=trilogy', function (err, response, body) {
        if (!err) {
            var info = JSON.parse(body);
            console.log('\nTitle: ' + info.Title + '\n' + 'Year: ' + info.Year + '\n' + 'IMDB Rating: ' + info.imdbRating  + '\n' + 'Country: ' + info.Country + '\n' + 'Language: ' + info.Language + '\n' + 'Plot: ' + info.Plot + '\n' + 'Actors: ' + info.Actors + '\n');
        }
    });
}

function doIt() {
    fs.readFile('random.txt', 'utf8', function(err, data) {
        if(!err) {
            let arg = data.split(',');
            if (arg[0] === 'spotify-this-song') {
                spotifyThis(arg[1]);
            }
        }
    })
}