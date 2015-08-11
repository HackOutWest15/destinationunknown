Template.activeGame.rendered = function() {
	var song;
	console.log('activeGameRendered');

	Meteor.subscribe('games', function(){
		console.log("subscribed!");

		var game = Games.fetch()[0];
		if(song)
			song.pause();
		this.playSong(this.getSongURL(game));
	});

}


function getSongURL(game){
	return game.songs[game.currentSong];
}

function playSong(url) {
	song = new Audio(url);
	song.play();
}