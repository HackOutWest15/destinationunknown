Meteor.methods({
    createGame: function(gameName) {
        var cityName = availableCities[Math.floor(Math.random() * availableCities.length)];
        console.log(gameName + " has answer " + cityName);
        var city = getCity(cityName);
        var artists = city.artists;

        var songPreviewURLs = [];
        artists.forEach(function(entry) {
            songPreviewURLs.push(entry.songs[0].preview_url);
        });
        
        console.log(songPreviewURLs);        
        var id = Games.insert({gameName: gameName, currentSong: 0, players: [], songs: songPreviewURLs});
        cityName = cityName.trim().toLowerCase();
        Answers.insert({gameId: id, city: cityName});
        startGame(id, 0);
        return id;
    }
});

startGame = function(gameId, i){
        if(i===2){
            console.log("THE GAME HAS ENDED")
            Games.update( {_id:gameId}, { $set: {currentSong: -1} });
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