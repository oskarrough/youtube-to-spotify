/**
 * Start and namespace the Ember application
 */
window.App = Ember.Application.create();

// Use the fixture adapter because we don't have a real REST api
App.ApplicationAdapter = DS.FixtureAdapter;

// App.Playlists.FIXTURES = [
// 	{ id: 1, firstName: 'Trek', lastName: 'Glowacki' },
// 	{ id: 2, firstName: 'Tom' , lastName: 'Dale'     }
// ];

/**
 * Models
 */
App.Playlist = DS.Model.extend({
	title: DS.attr('string'),
	firstName: DS.attr('string'),
	birthday:  DS.attr('date'),
	tracks: DS.hasMany('track')
	// fullName: function() {
	// 	return this.get('firstName') + ' ' + this.get('lastName');
	// }.property('firstName', 'lastName')
});

App.Track = DS.Model.extend({
	playlist: DS.belongsTo('playlist'),
	matched: DS.attr('boolean'),
	failed: DS.attr('boolean')
});

App.Router.map(function() {
	this.resource('convert');
});

App.ApplicationRoute = Ember.Route.extend({});

App.IndexRoute = Ember.Route.extend({
	redirect: function() {
		this.transitionTo('convert');
	}
});

App.ConvertRoute = Ember.Route.extend({
	model: function() {
		 this.store.push('playlist', {
			id: 1,
			title: "Fewer Moving Parts"
		 });
	},
	setupController: function(controller, playlist) {
		controller.set('model', this.store.find('playlist', 1));
	}
});

App.ConvertController = Ember.ObjectController.extend({
	isConverting: false,
	progress: 0,

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

	createPlaylist: function() {
		var store = this.store;

		var playlist = store.createRecord('playlist', {
		  title: 'Rails is Omakase',
		  body: 'Lorem ipsum'
		});

		store.find('user', 1).then(function(user) {
		  playlist.set('author', user);
		});
	},

	actions: {
		convert: function() {
			this.set('isConverting', true);
			console.log('convert');
			console.log(this.model.get('id'));
		},

	}
});

