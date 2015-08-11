var song;
Session.setDefault('infoText', "Now Playing");
Session.setDefault('songIndex', 0);
Session.setDefault('playerOne', {name: "-", stoppedAt: "", answer: null, guess: null});
Session.setDefault('playerTwo', {name: "-", stoppedAt: "", answer: null, guess: null});
Template.activeGame.created = function(){
    this.autorun(function(){
        console.log("autorun");
        var gameId = Session.get("gameId");
        var game = Games.find({_id: gameId}).fetch()[0];
        //console.log("SessionId: " + gameId + " , Game: " + game);
        if(game){
            handleSong(game);
            updatePlayersStatus(game);
        }
    });
};
Template.activeGame.helpers({
  songScore: function() {
  	console.log("songind: "+Session.get('songIndex'));
  	if(Session.get('songIndex') >=0){
  		return 10-Session.get('songIndex');
  	}
  	return 10;
  },
  playerOne: function(){
      console.log(Session.get("playerOne"))
      return Session.get("playerOne")
  },
  playerTwo: function(){
      return Session.get("playerTwo")
  },
  infoText: function(){
      return Session.get("infoText")
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
    if(game.currentSong === -1){
        endGame(game);
        console.log("ENDGAME!")
    } else{
        Session.set('songIndex', game.currentSong);
        updateUI();
        if(song){
            song.pause();
        }
        playSong(getSongURL(game));
    }
}
function getSongURL(game){
	return game.songs[game.currentSong];
}

function playSong(url) {
    console.log("playing songURL: "+url);
	song = new Audio(url);
	song.play();
}

function updatePlayersStatus(game){
    var playerOne = game.players[0];
    var playerTwo = game.players[1];
    console.log(playerOne);
    if(playerOne){
        Session.set("playerOne", {name: playerOne.name, stoppedAt: playerOne.score[0] ? playerOne.score[0].stoppedAt : "",
            score: null, guess : null})
    }
    if(playerTwo){
        Session.set("playerTwo", {name: playerTwo.name, stoppedAt: playerTwo.score[0] ? playerTwo.score[0].stoppedAt : "",
            score: null, guess : null})
    }
}

function endGame(game){
    playerOne = game.players[0];
    playerTwo = game.players[1];
    console.log("it's a TIE");
    var infoResult = "We were going to " + game.answer.toUpperCase() +"\n\n\n";
    var appendString = "It's a tie!";
    if(playerOne.score[0].score !== playerTwo.score[0].score){
        appendString = playerOne.score[0].score > playerTwo.score[0].score ? playerOne.name + " wins!" : playerTwo.name + " wins!"
    }
    infoResult += appendString;
    Session.set("playerOne", {name: playerOne.name, stoppedAt: playerOne.score[0] ? playerOne.score[0].stoppedAt : "",
        score: playerOne.score[0] ? playerOne.score[0].score : null, guess: playerOne.score[0] ? playerOne.score[0].guess : null})
    Session.set("playerTwo", {name: playerTwo.name, stoppedAt: playerTwo.score[0] ? playerTwo.score[0].stoppedAt : "",
        score: playerTwo.score[0] ? playerTwo.score[0].score : null, guess: playerTwo.score[0] ? playerTwo.score[0].guess : null})
    Session.set("infoText", infoResult);
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
