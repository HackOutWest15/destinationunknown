Meteor.methods({
    checkAnswer: function(gameId, answerToCheck) {
    	var playerId = Meteor.userId();
    	var currentGame = Games.find({_id: gameId}).fetch()[0];
    	var currentPlayer = currentGame.players.filter(function (p) {
    		return p.playerId == playerId;
    	})[0];
    	//console.log("playerId: " + playerId + " currentGame: " + currentGame + " currentPlayer: " + currentPlayer);
    	if(!currentPlayer.score[0]) {
    	    console.log("Made it!");
    	    answerToCheck = answerToCheck.toLowerCase().trim();
            var answer = Answers.find({gameId: gameId}).fetch()[0];
        	var correctAnswer = answerToCheck == answer.cities[currentGame.currentRound];
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