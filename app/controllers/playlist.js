import Ember from 'ember';

export default Ember.ObjectController.extend({
	isLoading: false,
	index: 1, // start index from where to search YouTube

	actions: {
		convert: function() {
			if (this.get('isLoading')) { return; }
			this.startConversion();
		}
	},

	// Match the items with Spotify
	startConversion: function() {
		var self = this;
		this.get('model.items').map(function(item) {
			var title = item.video.title;
			if (title === 'Deleted video') { return false; }
			self.matchItem(item);
		});
	},

	matchItem: function(item) {
		// var id = item.id;
		// var image = item.video.thumbnail.sqDefault;
		var title = item.video.title;
		var titleFiltered = this.filterTitle(title);
		// Search for a matching track
		var url = 'http://ws.spotify.com/search/1/track.json?q=' + encodeURIComponent(titleFiltered);
		return Ember.$.getJSON(url)
			.then(function(response) {
				var track = response.tracks[0];
				if (track) {
					console.log('found' + track.artists[0].name);
					// model.success.push(track);
					// insert(track.artists[0].name + ' - ' + track.name + '<small>(' + track.href + ')</small>', $success);
					// insert(track.href + '<small>(' + track.artists[0].name + ' - ' + track.name + ')</small>', $success);
				} else {
					console.log('not found ' + titleFiltered + ' ('+ title +')');
					// model.failed.push(name);
					// insert(name, $failed);
				}
			});
	},

	// would be nice to also filter out all years except 1999
	filterTitle: function(name) {
		name = name.match(/[\w']+/g)
			.join(' ')
			.replace(/official/ig, '')
			.replace(/featuring/ig, '')
			.replace(/feat/ig, '')
			.replace(/video/ig, '')
			.replace(/720p/ig, '')
			.replace(/1080p/ig, '')
			.replace(/version/ig, '')
			.replace(/wmv/ig, '')
			.replace(/7''/ig, '')
			.replace(/12''/ig, '');
		return name;
	}

	// ,
	// remaining: function() {
	// 	var todos = this.get('model');
	// 	return todos.filterBy('isDone', false).get('length');
	// }.property('todos.@each.isDone'),
});


// console.log('Done searching YouTube from ' + start);

// // Continue searching YouTube (50 results limit)
// start += apilimit;
// if (start < 1000) {
// 	loadPage();
// } else {
// 	console.log('youtube 1000 limit reached');
// }
