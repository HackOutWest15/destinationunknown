var song;
Template.activeGame.rendered = function() {

	console.log('activeGameRendered');


};

Meteor.subscribe('games', function(){
    console.log("INIT!");

    var game = Games.findOne();
    if(song)
        song.pause();
    playSong(getSongURL(game));
});



function getSongURL(game){
	return game.songs[game.currentSong];
}

function playSong(url) {
    console.log("playing songURL: "+url);
	song = new Audio(url);
	song.play();
}