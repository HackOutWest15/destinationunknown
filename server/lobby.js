//EENG

//M�hl
Meteor.publish("games", function() {
	return Games.find({players: {$size: 1}});
});