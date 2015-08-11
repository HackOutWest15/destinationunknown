Meteor.methods({
    checkAnswer: function(gameId, answerToCheck) {
        return Answers.find({gameId: gameId, city: answerToCheck}).count() > 0;
    }
});