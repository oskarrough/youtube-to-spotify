window.App = Ember.Application.create();

App.PlaylistModel = Ember.Object.extend({
	id: null,
	title: 'model title here',
	total: 0,
	analyzed: 0,
	matched: 0,
	failed: 0,
	progress: 0,
	matchedPercentage: 0
});

var playlist = App.PlaylistModel.create();

App.Router.map(function() {
  this.resource('convert');
});

// App.ApplicationRoute = Ember.Route.extend({});

App.IndexRoute = Ember.Route.extend({
	redirect: function() {
		this.transitionTo('convert');
	}
});

App.ConvertRoute = Ember.Route.extend({
	setupController: function(controller, song) {
		controller.set('model', playlist);
	}
});

App.ConvertController = Ember.ObjectController.extend({
	isConverting: false,

	init: function() {
		var self = this;

		// console.log($('.Playlist-input'));
		// console.log(this);

		// $('.Playlist-input').on('focus', function (event) {
		// 	console.log('he');
		// 	if (this.value !== '') {
		// 		$('.Playlist-submit').addClass('is-visible');
		// 	} else {
		// 		$('.Playlist-submit').removeClass('is-visible');
		// 	}
		// });
	},

	actions: {
		convert: function() {
			this.set('isConverting', true);
			console.log('convert');
			console.log(this.model.get('id'));
		},

	}
});

