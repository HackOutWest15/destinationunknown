Meteor.methods({
    createGame: function(gameName) {
        var cityData = availableCities[Math.floor(Math.random() * availableCities.length)];
        console.log(gameName + " has answer " + cityData.cityName);
        var city = getCity(cityData);
        var artists = city.artists;

        var songs = [];
        artists.forEach(function(entry) {
            songs.push({artist: entry.name, track: entry.songs[0].name, url: entry.songs[0].preview_url, spotify: entry.songs[0].external_urls.spotify});
        });
        
        console.log(songs);        
        var id = Games.insert({gameName: gameName, currentSong: 0, players: [], songs: songs, textsToShow:city.texts, answer: "...", gameStarted:false});
        cityName = cityData.cityName.trim().toLowerCase();
        Answers.insert({gameId: id, city: cityName.split("+")[0]});        
        return id;
    }
});

startGame = function(gameId, i){
        if(i === 0) {
            console.log("The game is commencing");
            Games.update( {_id:gameId}, { $set: {gameStarted: true} });
        }
        if(i === 10){
            console.log("THE game has ended");
            var correctAnswer = Answers.find({gameId: gameId}).fetch()[0].city;
            Games.update( {_id:gameId}, { $set: {currentSong: -1, answer: correctAnswer} });
            return
        }
        if(i < 10){
          Games.update( {_id:gameId}, { $set: {currentSong: i} });
          console.log("Game " + gameId + " is now at stage " + i);
          Meteor.setTimeout(function(){startGame(gameId, i + 1);}, 10000);
        } else {
          console.log("Game " + gameId + " is finished");
        }
}