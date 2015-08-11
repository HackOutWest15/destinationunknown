Meteor.methods({
    joinGame: function(gameId) {
        Games.update( {_id:gameId}, { $push: {players: Meteor.userId() } });

        var gameReady = Games.find( { _id:gameId, players: {$size: 2} } ).count();
        if(gameReady > 0) {
            startGame(gameId, 0);
        }        
    }
});

Meteor.publish("games", function() {
	return Games.find({players: {$size: 1}});
});