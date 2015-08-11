var song;

Meteor.subscribe('games', function(){

	Games = new Collection('games');
	var game = Games.fetch()[0];
	if(song)
		song.pause();
	this.playSong(this.getSongURL(game));
});


function getSongURL(game){
	return game.songs[game.currentSong];
}

function playSong(url) {
	song = new Audio(url);
	snd.play();
}