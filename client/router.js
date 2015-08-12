
Router.route('/game', {
    template:'activeGame',
    path:'/game/:_GameId',      
    data: function(){
        gameData = {
              _id : this.params._GameId
        };
        return gameData;
    }
});

Router.route('/', {template:'lobby', path:'/'});    

Router.configure({ notFoundTemplate: 'lobby'})


