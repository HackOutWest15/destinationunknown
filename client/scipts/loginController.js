Template.login.rendered = function() {
    if(!this._rendered) {
        this._rendered = true;
        if(Meteor.userId()){
            console.log(Meteor.userId());
            Router.go('lobby');
        }
    }
}