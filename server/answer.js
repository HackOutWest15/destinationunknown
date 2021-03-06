Meteor.methods({
    checkAnswer: function(gameId, answerToCheck) {
    	var playerId = Meteor.userId();
    	var currentGame = Games.find({_id: gameId}).fetch()[0];
    	var currentPlayer = currentGame.players.filter(function (p) {
    		return p.playerId == playerId;
    	})[0];
    	console.log("playerId: " + playerId + " currentGame: " + currentGame + " currentPlayer: " + currentPlayer);
    	if(currentPlayer.score[0].stoppedAt == 0 && currentGame.currentSong != -1) {
    	    console.log("Made it!");
    	    answerToCheck = answerToCheck.toLowerCase().trim();
        	var correctAnswer = Answers.find({gameId: gameId, city: answerToCheck}).count() > 0;
        	var givenScore = 10 - currentGame.currentSong;

        	if(correctAnswer) {
        		Games.update({_id: gameId, "players.playerId": playerId}, 
        			{$set: {"players.$.score.0": {stoppedAt: givenScore, score: givenScore, guess: answerToCheck}}}
        			);
        	} else {
        		Games.update({_id: gameId, "players.playerId": playerId}, 
        			{$set: {"players.$.score.0": {stoppedAt: givenScore, score: 0, guess: answerToCheck}}}
        			);
        	}
        	return true;
    	}
    	return false;
    }
});