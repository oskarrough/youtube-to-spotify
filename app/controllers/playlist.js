import Ember from 'ember';

export default Ember.ObjectController.extend({
	isLoading: false,
	isDoneLoading: false,
	endpointIndex: 51, // 1 + api limit which is 50 because we already loaded the first

	status: function() {
		var msg;
		if (this.get('isLoading')) {
			msg = 'Loading… ';
		} else if (this.get('isDoneLoading')) {
			msg = 'All done. Here are your ';
		} else {
			msg = 'Previewing ';
		}
	  return msg;
	}.property('isLoading'),

	actions: {
		convert: function() {
			this.findAll();
		}
	},

	// Set endpoint based on ID and current endpoint index
	endpoint: function() {
		var url = 'https://gdata.youtube.com/feeds/api/playlists/'+ this.get('model.id') +'?alt=jsonc&v=2&start-index='+ this.get('endpointIndex') +'&max-results=50';
		console.log(url);
		return url;
	}.property('endpointIndex'),

	// Recursively find all items in a playlist
	findAll: function() {
		var self = this;
		this.set('isLoading', true);

		Ember.$.getJSON(this.get('endpoint')).then(function(response) {
			if (response.data.items) {
				self.incrementProperty('endpointIndex', 50);
				self.get('model.items').pushObjects(response.data.items);
				self.findAll();
			} else {
				self.toggleProperty('isDoneLoading');
				self.set('isLoading', false);
				return false;
			}
		});
	}
	// ,
	// remaining: function() {
	// 	var todos = this.get('model');
	// 	return todos.filterBy('isDone', false).get('length');
	// }.property('todos.@each.isDone'),
});


// // Try to match all tracks with Spotify
// for (var i = 0; i < data.items.length; i++) {
// 	var item = data.items[i];
// 	var name = item.video.title;
// 	// var name = item.video.title || [];
// 	searchSpotify(name);
// }

// console.log('Done searching YouTube from ' + start);

// // Continue searching YouTube (50 results limit)
// start += apilimit;
// if (start < 1000) {
// 	loadPage();
// } else {
// 	console.log('youtube 1000 limit reached');
// }
