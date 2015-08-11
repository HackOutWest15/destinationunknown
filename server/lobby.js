Meteor.methods({
    joinGame: function(gameId) {
        var gameToJoin = Games.update( {_id:gameId}, { $push: {players: Meteor.userId() } });
    }
});

//Möhl
Meteor.publish("games", function() {
	return Games.find({players: {$size: 1}});
});