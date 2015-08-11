Meteor.methods({
    createGame: function(gameName) {
        var cityName = "New York";
        var city = getCity(cityName);
        var artists = getArtistsForCity(cityName).splice(0,10);
        artists = appendSongDataToArtists(artists);

        var songPreviewURLs = [];
        artists.forEach(function(entry) {
            songPreviewURLs.push(entry.songs[0].preview_url);
        });
        
        console.log(songPreviewURLs);        
        var id = Games.insert({gameName: gameName, currentSong: 0, players: [], songs: songPreviewURLs});
        startGame(gameName, 0);
        return id;
    }
});

startGame = function(gameId, i){
        if(i < 10){
          Games.update( {gameName:gameId}, { $set: {currentSong: i} });
          console.log("Game " + gameId + " is now at stage " + i);
          Meteor.setTimeout(function(){startGame(gameId, i + 1);}, 10000);
        } else {
          console.log("Game " + gameId + " is finished");
        }
}