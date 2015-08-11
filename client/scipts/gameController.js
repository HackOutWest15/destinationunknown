var song;
Session.setDefault('songIndex', 0);
Template.activeGame.created = function(){
    this.autorun(function(){
        console.log("autorun");
        var gameId = Session.get("gameId");
        var game = Games.find({_id: gameId}).fetch()[0];
        //console.log("SessionId: " + gameId + " , Game: " + game);
        if(game){
            handleSong(game);
        }
    });
};

Template.activeGame.helpers({
  songScore: function() {
  	console.log("songind: "+Session.get('songIndex'))
  	if(Session.get('songIndex') >=0){
  		return 10-Session.get('songIndex');
  	}
  	return 10;	
  }
});

Template.activeGame.rendered = function() {
	console.log('activeGameRendered');
};

Meteor.subscribe('games', function(){
    console.log("INIT!");

});

function updateUI(){
	$('#gameProgress').css('width', (Session.get('songIndex')+1)*10+'%').attr('aria-valuenow',Session.get('songIndex'));
}

function handleSong(game){
	Session.set('songIndex', game.currentSong);
	updateUI();
    if(song){
        song.pause();
    }
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
        $(".container").addClass("blurred");
    },
    'click #modalAnswer': function () {
        var answer = $('#answerInput').val();
        console.log(answer);

        Meteor.call("checkAnswer", Session.get("gameId"), answer);
        $(".container").removeClass("blurred");
        $("#gameModal").hide();
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
