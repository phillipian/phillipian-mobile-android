//http://coenraets.org/blog/2011/12/backbone-js-wine-cellar-tutorial-part-1-getting-started/
window.Article = Backbone.Model.extend();

window.ArticleCollection = Backbone.Collection.extend({
    model: Article,
    url: "http://www.phillipian.net/mobile/node.json"
});

window.ArticleListView = Backbone.View.extend({
    tagName: 'ul',
    id: 'article-list',
	//attributes: {'data-role': 'list-view'},
    initialize: function () {
        this.model.bind("reset", this.render, this);
    },
    render: function (eventName) {
    	
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
    render: function (eventName) {
    	$(this.el).html(this.model.get("title"));
        return this;
    }
});

var AppRouter = Backbone.Router.extend({
    routes:{
        "": "list",
        "article/:id": "articleView"
    },
 
    list: function () {
        this.articleList = new ArticleCollection();
        this.articleListView = new ArticleListView({model:this.articleList});
        this.articleList.fetch();
        //$('#main').html("hello");
        $('#main-content').html(this.articleListView.render().el);
    },
 
    articleView:function (nid) {
        this.article = this.articleList.get(nid);
        this.articleView = new ArticleView({model:this.article});
        //$('#content').html(this.wineView.render().el);
    }
});
 
var app = new AppRouter();
Backbone.history.start();

$(document).ready(function() {
	document.addEventListener("deviceready", onDeviceReady, false);
});

var pictureSource; // picture source
var destinationType; // sets the format of returned value
$(document).ready(function() {
	document.addEventListener("deviceready", onDeviceReady, false);

});
function onDeviceReady() {
	document.addEventListener("menubutton", onMenuKeyDown, false);
	pictureSource = navigator.camera.PictureSourceType;
	destinationType = navigator.camera.DestinationType;
	$.getJSON('http://www.phillipian.net/mobile/all.json', function(data) {
		$.each(data.articles, function(i, value) {
			$("<li></li>")
					.html("<a href=\"#\">" + value.article.title + "</a>")
					.appendTo("#articles-list");

		});
		$('#articles-list').listview('refresh');
	});
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