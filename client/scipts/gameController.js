var song;
Template.activeGame.created = function(){
    this.autorun(function(){
        console.log("autorun");
        games = Games.find();
        if(games.fetch()[0]){
            handleSong(games.fetch()[0]);
        }
    });
};

Template.activeGame.rendered = function() {

	console.log('activeGameRendered');


};

Meteor.subscribe('games', function(){
    console.log("INIT!");

});


function handleSong(game){
    if(song)
        song.pause();
    playSong(getSongURL(game));
}
function getSongURL(game){
	return game.songs[game.currentSong];
}

function playSong(url) {
    console.log("playing songURL: "+url);
	song = new Audio(url);
	song.play();
}