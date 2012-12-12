$(document).bind("mobileinit", function () {
    $.mobile.ajaxEnabled = false;
    $.mobile.linkBindingEnabled = false;
    $.mobile.hashListeningEnabled = false;
    $.mobile.pushStateEnabled = false;
    $.mobile.defaultPageTransition = 'none';
    
    // Remove article page from DOM on back press
    
    $('.article-page').live('pagehide', function (event, ui) {
    	console.log("Removing article from DOM")
        $(event.currentTarget).remove();
    });
});