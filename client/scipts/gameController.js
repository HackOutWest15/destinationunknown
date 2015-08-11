var song;
Meteor.subscribe('games', function(){

	Games = new Collection('games');
	var game = Games.fetch()[0];
	if(song)
		song.pause();
	this.playSong(this.getSongURL(game));
});


getSongURL: function(game){
	return game.songs[game.currentSong];
}

playSongURL: function(url) {
	song = new Audio(url);
	snd.play();
}