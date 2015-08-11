Template.startGame.events({
    'click #startbutton': function(e) {
        console.log("GAME")
         Router.go('game', {
          _GameId: 'pns'
        });
    }
});