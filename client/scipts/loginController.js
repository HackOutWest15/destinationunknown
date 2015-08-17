function showHelpModal(){
	$("#helpModal").show();
    $(".container").addClass("blurred");
};

Template.helpTemplate.events({
	'click #helpButton': function(){
		console.log("clicked");
		showHelpModal();
	}
});

