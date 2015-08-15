Meteor.methods({
    joinGame: function(gameId) {
        var name = "Unknown user";
        if(Meteor.user().profile) {
            name = Meteor.user().profile.name; 
        } else {
            var name = Meteor.user().username;    
        }
        
        var player = {playerId: Meteor.userId(), name: name , score: [
        	{stoppedAt:0, score:0, guess:"No guess"}]};
            
        var game = Games.findOne({_id:gameId});
        if(game.players.length == 0){            
            Games.update( {_id:gameId}, { $push: {players: player } });
        }
        else if(game.players[0].playerId != player.playerId){
            Games.update( {_id:gameId}, { $push: {players: player } });
            var gameReady = Games.find( { _id:gameId, players: {$size: 2} } ).count();
            if(gameReady > 0) {
                startGame(gameId, 0);
            }     
        }
    }
});

Meteor.publish("games", function() {
	return Games.find({});
});