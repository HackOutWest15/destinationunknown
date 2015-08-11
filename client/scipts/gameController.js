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

Template.activeGame.events({
    'click #answerButton': function () {
        $("#gameModal").show();
    },
    'click #modalAnswer': function () {
        var bla = $('#answerInput').val();
        Meteor.call(checkAnswer("id", bla));
    }
});

Template.answerModal.events({
    'click .hide-modal' : function(){
        $("#gameModal").hide();
        console.log("closed");
    },
    'click .hide-modal' : function(){
        $("#gameModal").hide();
        console.log("closed");
    },
    'click #createGame' : function(){
        console.log('clickcreate');
        Router.go('game');
    }
});
