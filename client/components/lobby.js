Template.lobby.helpers({
	gameList: function () {
      return Games.find({players: {$size: 1}})
    }
  });

Template.lobby.events({
    "submit .new-game": function (event) {
	    event.preventDefault();
	       
	    var text = event.target.text.value;
	 
	    Meteor.call("createGame", text, function(error, result) {
	    	Meteor.call("joinGame", result);
	    	console.log("result is: " + result);
	    	Session.set("gameId", result);
	    	console.log("GameId: " + Session.get("gameId"));
	    	Router.go("game", {
		        _GameId: result	
	        });
	    });

	    // Clear form
	    event.target.text.value = "";
    }
  });