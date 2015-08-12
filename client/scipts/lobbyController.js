Template.lobby.rendered = function() {
    Session.set("spins", false);
    this.autorun(function(){
        console.log("autorun2");
        if(Meteor.userId()){
            console.log(Meteor.userId());
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
        console.log(gName);
        // activate loaders
        $("#createNewGameButton").button('loading');
        Session.set("spins", true);
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
    }
});

Template.gameCard.helpers({
	gameOwner: function() {
		console.log('pl:'+this.players[0].name);
		return this.players[0].name;
	}
});
Template.lobby.helpers({
	spinTime: function() {
		console.log('in spintime')
		//this.autorun(function(){
			console.log(Session.get("spins"));
			
			return Session.get("spins");
		//});
	}
});

joinGame = function(gameId) {
	if(!Session.get("spins")){
		Meteor.call("joinGame", gameId);
		console.log("gameId is: " + gameId);
		Session.set("gameId", gameId);
		console.log("GameId: " + Session.get("gameId"));
		Router.go("game", {
	        _GameId: gameId	
	    });
	}
}