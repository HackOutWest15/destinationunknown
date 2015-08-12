Template.login.rendered = function() {
    if(!this._rendered) {
        this._rendered = true;
        if(Meteor.userId()){
            console.log(Meteor.userId());
            Router.go('lobby');
        }
    }
    //new untested and stronk
    this.autorun(function(){
        console.log("autorun2");
        if(Meteor.userId() && !Meteor.loggingIn()){
            console.log(Meteor.userId());
            Router.go('lobby');
        }
    });
}
