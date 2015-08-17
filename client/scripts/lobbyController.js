Template.lobby.rendered = function() {
    Session.set("spins", false);
    this.autorun(function(){
        if(Meteor.userId()){
            $("#createNewGameButton").show();
            $("#welcome-text").hide();
        } else {
            $("#createNewGameButton").hide();
            $("#welcome-text").show();
        }
       
    });
}
Session.setDefault("spins", false);

Template.lobby.events({
    'click #closeModal': function () {
        $("#createModal").hide();
    },
    'click #createNewGameButton': function () {
        $("#createModal").show();
        
        
    },
    'click #createGameName': function () {
        var gName = $('#answerInput').val();
        // activate loaders
        $("#createNewGameButton").button('loading');
        Session.set("spins", true);
        //Meteor.call("checkAnswer", Session.get("gameId"), answer);
        $("#createModal").hide();
        Meteor.call("createGame", gName, function(error, result) {
	    	Meteor.call("joinGame", result);
	    	Session.set("gameId", result);
	    	Games.find(result).playerTwo;
	    	Router.go("game", {
		        _GameId: result	
	        });
	    });
    }
});

Template.gameCard.helpers({
	gameOwner: function() {
		return this.players[0].name;
	}
});
Template.lobby.helpers({
	spinTime: function() {		
		return Session.get("spins");
		//});
	}
});

joinGame = function(gameId) {
	if(!Session.get("spins")){
		Meteor.call("joinGame", gameId);
		Session.set("gameId", gameId);
		Router.go("game", {
	        _GameId: gameId	
	    });
	}
}