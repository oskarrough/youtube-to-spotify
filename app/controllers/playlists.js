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
		this.get('model.items').forEach(function(item) {
			this.matchItem(item);
		}.bind(this));
	},

	matchItem: function(item) {
		var title = item.get('title');
		var filteredTitle = this.filterTitle(title);

		// Search for a matching track
		var endpoint = 'http://ws.spotify.com/search/1/track.json?q=' + encodeURIComponent(filteredTitle);
		return Ember.$.getJSON(endpoint).then(function(response) {
			var track = response.tracks[0];
			if (track) {
				console.log('found' + track.artists[0].name);

				item.set('spotifyTitle', track.artists[0].name);
				item.set('isMatched', true);
				// insert(track.artists[0].name + ' - ' + track.name + '<small>(' + track.href + ')</small>', $success);
				// insert(track.href + '<small>(' + track.artists[0].name + ' - ' + track.name + ')</small>', $success);
			} else {
				console.log('not found ' + filteredTitle + ' ('+ title +')');
				item.set('isMatched', false);
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
});


// console.log('Done searching YouTube from ' + start);

// // Continue searching YouTube (50 results limit)
// start += apilimit;
// if (start < 1000) {
// 	loadPage();
// } else {
// 	console.log('youtube 1000 limit reached');
// }
