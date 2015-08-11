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
        return Games.insert({gameName: gameName, currentSong: 0, players: [], songs: songPreviewURLs});
    }
});

function startPlayList(gameName, songs, i){
        if(i < 10){
          Games.update(gameName, {
              $set: {currentSong: i}
          });
          Meteor.setTimeout(function(){startPlayList(gameName, songs, i + 1);}, 30000);
        }
}