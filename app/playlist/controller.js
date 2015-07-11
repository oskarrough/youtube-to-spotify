import Ember from 'ember';

export default Ember.Controller.extend({
	endpoint: 'http://ws.spotify.com/search/1/track.json?q=',
	startedMatching: false,
	isMatching: false,

	// as soon as we have a model
	// start matching items with possible spotify items
	startMatching: Ember.observer('model.items.[]', function() {
		console.log('startMatching');

		Ember.run.next(() => {
			console.log('startMatching next');
		});

		// make sure it doesn't run twice simultaneously
		if (this.get('isMatching')) { return; }

		// indicate we're matching
		this.set('startedMatching', true);
		this.set('isMatching', true);

		// Create a promise for each item's 'matchItem'
		var promises = this.get('model.items').map(function(item) {
			return this.matchItem(item);
		}.bind(this));

		// Wait for all promises to resolve
		Ember.RSVP.all(promises).then((/*promise*/) => {
			this.set('isMatching', false);
			this.set('doneMatching', true);
		}).catch((reason) => {
			console.log(reason);
		});
	}),

	// Matches an item with one from Spotify
	matchItem(item) {
		var url = this.get('endpoint') + encodeURIComponent(item.get('cleanTitle'));

		return Ember.$.getJSON(url).then((response) => {
			var results = response.tracks;

			item.set('isMatched', Boolean(results.length));

			// stop if we have no results
			if (!results.length) {
				return false;
			}

			// create a nice array of results
			var newResults = results.map((result) => {
				return this.get('store').createRecord('spotifyItem', {
					artist: result.artists[0].name,
					title: result.name,
					album: result.album.name,
					albumRelease: result.album.released,
					url: result.href,
					playlistItem: item
				});
			});

			// push them
			return results.pushObjects(newResults);
		});
	}
});
