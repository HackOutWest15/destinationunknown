var song = new Audio();
var currentlyPlayingUrl;

Template.activeGame.created = function(){
    Session.setDefault("gameName", "");
    Session.setDefault("trivia", "TRIVIA");
    Session.setDefault('infoText', "Waiting for players");
    Session.setDefault('songIndex', 0);
    Session.setDefault('playerOne', {name: "-", stoppedAt: "", answer: null, guess: null});
    Session.setDefault('playerTwo', {name: "-", stoppedAt: "", answer: null, guess: null});
    Session.setDefault("artistAndSongs", null);
    Session.set("gameName", "");
    Session.set("trivia", "TRIVIA");
    Session.set('infoText', "Waiting for players");
    Session.set('songIndex', 0);
    Session.set('playerOne', {name: "-", stoppedAt: "", answer: null, guess: null});
    Session.set('playerTwo', {name: "-", stoppedAt: "", answer: null, guess: null});
    Session.set("artistAndSongs", null);
    $('body').on('keydown',function(event) {
            if(event.keyCode == 32 && $("#answerButton").is(":visible")){
                showAnswerModal();
            }
        });


    this.autorun(function(){
        var gameId = Session.get("gameId");
        var game = Games.find({_id: gameId}).fetch()[0];


        if(game){
            if(game.gameStarted) {
              Session.set('infoText', "Now playing");
            }
            Session.set("gameName", game.gameName.toUpperCase());
            if(game.currentSong === -1){
                endGame(game);
            } else {
                handleSong(game);
                updatePlayersStatus(game);
            }
        }
    });
};
Template.activeGame.onDestroyed(function () {
    if(song){
        song.pause();
    }
});
Template.activeGame.helpers({
  songScore: function() {
  	if(Session.get('songIndex') >=0){
  		return 10-Session.get('songIndex');
  	}
  	return 10;
  },
  playerOne: function(){
      return Session.get("playerOne")
  },
  playerTwo: function(){
      return Session.get("playerTwo")
  },
  infoText: function(){
      return Session.get("infoText")
  },
  gameName: function(){
      return Session.get("gameName");
  },
  trivia: function(){
      return Session.get("trivia")
  },
  artistAndSongs: function(){
      return Session.get("artistAndSongs")
  }
});

Template.activeGame.rendered = function() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
        $("#unmute-div").show();
    }
};


Meteor.subscribe('games', function(){

});

function updateUI(){
	$('#gameProgress').css('width', (Session.get('songIndex')+1)*10+'%').attr('aria-valuenow',Session.get('songIndex'));
}

function handleSong(game){
    var songToPlay = getSongURL(game);

    //Don't restart the song if it's still the same song!    
    if(game.gameStarted && songToPlay != currentlyPlayingUrl) {
      currentlyPlayingUrl = songToPlay;
      Session.set('songIndex', game.currentSong);
      Session.set("trivia", game.textsToShow[game.currentSong]);
      updateUI();
      if(song){
          song.pause();
      }
      playSong(getSongURL(game));
    }
}
function getSongURL(game){
	return game.songs[game.currentSong].url;
}

function playSong(url) {
	song.src=url;
	song.play();
}

function updatePlayersStatus(game){
    var playerOne = game.players[0];
    var playerTwo = game.players[1];
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
    var answerString = "We were going to " + game.answer.toUpperCase() +"\n\n\n";
    var resultString = "It's a tie!";
    if(playerOne.score[0].score !== playerTwo.score[0].score){
        resultString = playerOne.score[0].score > playerTwo.score[0].score ? playerOne.name + " wins!" : playerTwo.name + " wins!"
    }
    Session.set("playerOne", {name: playerOne.name, stoppedAt: playerOne.score[0].stoppedAt,
        score: playerOne.score[0].score, guess: playerOne.score[0].guess.toUpperCase()})
    Session.set("playerTwo", {name: playerTwo.name, stoppedAt: playerTwo.score[0].stoppedAt,
        score: playerTwo.score[0].score, guess: playerTwo.score[0].guess.toUpperCase()})
    Session.set("infoText", answerString);
    Session.set("trivia", resultString);
    Session.set("artistAndSongs", game.songs);
    var answerButton = document.getElementById('answerButton');
    answerButton.style.display = 'none';
    var leaveButton = document.getElementById('leaveButton');
    leaveButton.style.display = 'inline';
    var forfeitButton = document.getElementById('forfeitButton');
    forfeitButton.style.display = "none"
}

function showAnswerModal(){
    $("#gameModal").show();
    $(".container").addClass("blurred");
    $("#answerInput")[0].focus()
}

Template.activeGame.events({
    'click #answerButton': function () {
        showAnswerModal();
    },
    'click #modalAnswer': function () {
        checkAnswer();
    },
    'click #unmute-button': function () {
      if(song){
          song.play();
          $("#unmute-div").hide();
      }
    }
});

Template.answerModal.created = function() {
    $('body').on('keydown', function (event) {
        if (event.keyCode == 13 && $("#modalAnswer").is(":visible")) {
            checkAnswer();
        }
    });
};

function checkAnswer(){
    var answer = $('#answerInput').val();

    Meteor.call("checkAnswer", Session.get("gameId"), answer);

    $(".container").removeClass("blurred");
    $("#gameModal").hide();
}
Template.answerModal.events({
    'click .hide-modal' : function(){
        $("#gameModal").hide();
    },
    'click .hide-modal' : function(){
        $("#gameModal").hide();
    },
    'click #createGame' : function(){
        Router.go('game');
    }
});

Template.activeGame.events({
    'click #leaveButton': function () {
        Router.go('/');
    }
});

Template.activeGame.events({
    'click #forfeitButton': function () {
        var gameId = Session.get("gameId");
        var numberOfPlayers = Games.findOne({_id: gameId}).players.length;
        //console.log(numberOfPlayers);
        if(numberOfPlayers < 2) {
            Router.go('/');
            Games.remove({_id: gameId});
        } else {
            Router.go('/');
        }
    }
})
