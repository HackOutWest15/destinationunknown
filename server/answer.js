Meteor.methods({
    checkAnswer: function(gameId, answerToCheck) {
        answerToCheck = answerToCheck.toLowerCase();
        answerToCheck = answerToCheck.trim();
        return Answers.find({gameId: gameId, city: answerToCheck}).count() > 0;
    }
});