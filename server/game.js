Meteor.methods({
    createGame: function(gameName) {
        var cities = shuffle(availableCities).slice([[,3]]);
        console.log(gameName + " has answers " + cities);
        var rounds = [];
        cities.forEach(function(cityName){
            var city = getCity(cityName);
            var artists = city.artists;
            var songPreviewURLs = getSongPreviewUrls(artists);
            rounds.push({currentSong: 0, songs: songPreviewURLs});
        });
        
        var game = {gameName: gameName, currentRound: 0, players: [], rounds: rounds};
        console.log(JSON.stringyfy(game));
        var id = Games.insert(game);
        cityName = cityName.trim().toLowerCase();
        Answers.insert({gameId: id, cities: cities});
        startGame(id, 0, 0);
        return id;
    }
});

startGame = function(gameId, roundIndex, songIndex){
    if(roundIndex < 3){
        if(songIndex < 10){
          Games.update( {_id:gameId}, { $set: {currentSong: songIndex} });
          console.log("Game " + gameId + " is now at stage " + songIndex);
          Meteor.setTimeout(function(){startGame(gameId, roundIndex,songIndex + 1);}, 10000);
        } else {
            round = roundIndex + 1;
          console.log("Round " + round + " is finished");
        }
    } else {
        console.log("Game " + gameId + " is finished")
    }
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function getSongPreviewUrls(artists) {
    var songPreviewURLs = [];
    artists.forEach(function(entry) {
        songPreviewURLs.push(entry.songs[0].preview_url);
    });

    console.log(songPreviewURLs);
    return songPreviewURLs;
}
