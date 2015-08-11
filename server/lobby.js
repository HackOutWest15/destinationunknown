Meteor.methods({
    joinGame: function(gameId) {
        var player = {playerId: Meteor.userId(), name: Meteor.user().profile.name, score: []};

        Games.update( {_id:gameId}, { $push: {players: player } });

        var gameReady = Games.find( { _id:gameId, players: {$size: 2} } ).count();
        if(gameReady > 0) {
            startGame(gameId, 0);
        }        
    }
});

Meteor.publish("games", function() {
	return Games.find({});
});