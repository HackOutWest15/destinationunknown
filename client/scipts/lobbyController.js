Template.lobby.rendered = function() {
    //new untested and stronk
    this.autorun(function(){
        console.log("autorun2");
        if(Meteor.userId() && !Meteor.loggingIn()){
            console.log(Meteor.userId());
            $("#createNewGameButton").show();
        } else {
            $("#createNewGameButton").hide();
        }
    });
}

Template.lobby.events({
    'click #answerButton': function () {
    	console.log("hiihi");
        $("#createModal").show();
    },
    'click #createGameName': function () {
        var gName = $('#answerInput').val();
        console.log(gName);

        //Meteor.call("checkAnswer", Session.get("gameId"), answer);
        $("#createModal").hide();
        Meteor.call("createGame", gName, function(error, result) {
	    	Meteor.call("joinGame", result);
	    	console.log("result is: " + result);
	    	Session.set("gameId", result);

	    	console.log("GameId: " + Session.get("gameId"));
	    	Games.find(result).playerTwo;
	    	Router.go("game", {
		        _GameId: result	
	        });
	    });
    },
    'click .lobby-cards': function(){
    	console.log("dssd");
    	console.log(JSON.stringify(this));
    }
});

Template.gameCard.helpers({
	gameOwner: function() {
		console.log('pl:'+this.players[0].name);
		return this.players[0].name;
	}
});

joinGame = function(gameId) {
	Meteor.call("joinGame", gameId);
	console.log("gameId is: " + gameId);
	Session.set("gameId", gameId);
	console.log("GameId: " + Session.get("gameId"));
	Router.go("game", {
        _GameId: gameId	
    });
}