//http://coenraets.org/blog/2011/12/backbone-js-wine-cellar-tutorial-part-1-getting-started/
window.Article = Backbone.Model.extend({
	idAttribute: "nid"
});

window.ArticleCollection = Backbone.Collection.extend({
    model: Article,
    url: "http://www.phillipian.net/mobile/views/services_article_list.json"
});

window.ArticleListView = Backbone.View.extend({
    tagName: 'ul',
    id: 'article-list',
    initialize: function () {
        this.model.bind("reset", this.render, this);
    },
    render: function (eventName) {	
    	console.log("rendering ArticleListView");
        _.each(this.model.models, function (article) {
        	$(this.el).listview();
            $(this.el).append(new ArticleListItemView({model:article}).render().el);
            $(this.el).listview("refresh");
        }, this);
        return this;
    }
});

window.ArticleListItemView = Backbone.View.extend({
    tagName: 'li',
    template: _.template($('#ArticleListItemView-tpl').html()),
    //template: _.template('<a href="#article/<%= nid %>"><h3 class="ui-li-heading"><%= title %></h3><p class="ui-li-aside ui-li-desc"><%= section %></p><p class="ui-li-desc"><%= writer %></p></a>'),
    render: function (eventName) {
    	$(this.el).html(this.template(this.model.toJSON()));
        return this;
    }
});

window.HomePageView = Backbone.View.extend({
    render: function (eventName) {
		$(this.el).html($('#HomePageView-tpl').html());
        return this;
    }
});

window.ArticlePageView = Backbone.View.extend({
    template: _.template($('#ArticlePageView-tpl').html()),
    render: function (eventName) {
		$(this.el).html(this.template(this.model.toJSON()));
        $('.back').live('click', function(event) {
        	$.mobile.changePage($("#home"), {changeHash:false, transition: 'none'});
        });
        return this;
    }
});

window.TestView = Backbone.View.extend({
    render: function (eventName) {
        $(this.el).html('<h1>test</h1>');
        return this;
    }
});

window.back = function() {
	window.history.back();
    return false;
};

var AppRouter = Backbone.Router.extend({
	initialize: function () {
        // Handle back button throughout the application
        $('.back').live('click', function(event) {
        	$.mobile.changePage($("#home"), {changeHash:false, transition: 'none'});
        });
    },
    
	routes: {
        "": "home",
        "test": "test",
        "article/:nid": "articleView"
    },
    
    home: function () {
		this.articleList = new ArticleCollection();
        this.articleListView = new ArticleListView({model:this.articleList});
        this.articleList.fetch();
        $('#main-content').html(this.articleListView.render().el);
    },
    
    
    test: function() {
    	this.changePage(new TestView());
    },
    
    articleView: function (nid) {
    	console.log("Changed to article with nid " + nid);
    	//this.article = new Article({id: nid});
    	this.article = this.articleList.get(nid);
        this.articlePageView = new ArticlePageView({model: this.article});
        this.changePage(this.articlePageView);
    },
    
    changePage: function (page) {
        $(page.el).attr('data-role', 'page');
        page.render();
        $('body').append($(page.el));
        var transition = $.mobile.defaultPageTransition;
        // We don't want to slide the first page
        if (this.firstPage) {
            transition = 'none';
            this.firstPage = false;
        }
        $.mobile.changePage($(page.el), {changeHash:false, transition: transition});
    }
    
});


$(document).ready(function() {
	document.addEventListener("deviceready", onDeviceReady, false);
	
	$("#main-content").niceScroll();
	var app = new AppRouter();
	Backbone.history.start();
	document.addEventListener("backbutton", app.back, false);

	/*document.body.addEventListener('touchmove', function(e) {
	    // Cancel the event
	    e.preventDefault();
	}, false);*/
});

var pictureSource; // picture source
var destinationType; // sets the format of returned value

function onDeviceReady() {
	document.addEventListener("menubutton", onMenuKeyDown, false);
	pictureSource = navigator.camera.PictureSourceType;
	destinationType = navigator.camera.DestinationType;
}
function onMenuKeyDown() {
	$("[data-position='fixed']").fixedtoolbar('toggle');
}
// Called when a photo is successfully retrieved
//
function onPhotoDataSuccess(imageData) {
	// Uncomment to view the base64 encoded image data
	// console.log(imageData);

	// Get image handle
	//
	var smallImage = document.getElementById('smallImage');

	// Unhide image elements
	//
	smallImage.style.display = 'block';

	// Show the captured photo
	// The inline CSS rules are used to resize the image
	//
	smallImage.src = "data:image/jpeg;base64," + imageData;
}

// Called when a photo is successfully retrieved
//
function onPhotoURISuccess(imageURI) {
	// Uncomment to view the image file URI
	// console.log(imageURI);

	// Get image handle
	//
	var largeImage = document.getElementById('largeImage');

	// Unhide image elements
	//
	largeImage.style.display = 'block';

	// Show the captured photo
	// The inline CSS rules are used to resize the image
	//
	largeImage.src = imageURI;
}

// A button will call this function
//
function capturePhoto() {
	// Take picture using device camera and retrieve image as base64-encoded
	// string
	navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
		quality : 50,
		destinationType : destinationType.DATA_URL
	});
}

// A button will call this function
//
function capturePhotoEdit() {
	// Take picture using device camera, allow edit, and retrieve image as
	// base64-encoded string
	navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
		quality : 20,
		allowEdit : true,
		destinationType : destinationType.DATA_URL
	});
}

// A button will call this function
//
function getPhoto(source) {
	// Retrieve image file location from specified source
	navigator.camera.getPicture(onPhotoURISuccess, onFail, {
		quality : 50,
		destinationType : destinationType.FILE_URI,
		sourceType : source
	});
}

// Called if something bad happens.
// 
function onFail(message) {
	alert('Failed because: ' + message);
}