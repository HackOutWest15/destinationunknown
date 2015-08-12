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

Template.helpModal.events({
	'click #modalDone': function() {
		console.log("fewo")
		$("#helpModal").hide();
		$(".container").removeClass("blurred");
	}
});