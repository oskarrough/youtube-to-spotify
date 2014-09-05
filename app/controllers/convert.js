import Ember from 'ember';

export default Ember.ArrayController.extend({
	playlistID: 'OSKAR',
	start: 1,
	apilimit: 50,

	url: function() {
		var id = this.get('playlistID');
		var start = this.get('start');
		var apilimit = this.get('apilimit');

		return 'https://gdata.youtube.com/feeds/api/playlists/' + id + '?alt=jsonc&v=2&start-index=' + start + '&max-results=' + apilimit;
	}.property('playlistID', 'start'),

	// remaining: function() {
	// 	var todos = this.get('model');
	// 	return todos.filterBy('isDone', false).get('length');
	// }.property('todos.@each.isDone'),
/*
	loadPlaylist: function() {
		var self = this;



		Ember.$.getJSON(url).then(function(data) {
			self.pushObjects(data.data.items);

			// Continue searching YouTube (50 results limit)
			this.get('start') += this.get('apilimit');
			if (this.get('start') < 1000) {
				loadPage();
			} else {
				console.log('youtube 1000 limit reached');
			}
		});
	},*/

	actions: {
		add: function() {
			this.set('playlistID', this.get('playlistID'));
		}
	}
});
