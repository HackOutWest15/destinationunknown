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
  console.log('yo');

  Router.route('/lobby', {template:'lobby'});  
  Router.route('/', {template:'login'});    

