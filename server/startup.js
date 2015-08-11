Meteor.startup(function(){
    availableCities.forEach(function(cityName) {
        if (Cities.find({name: cityName}).count() < 1) {
            getCity(cityName);
            Meteor._sleepForMs(60000);
        }
    });
});
