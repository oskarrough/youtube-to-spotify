import Ember from 'ember';

export default Ember.Controller.extend({
	endpoint: 'http://ws.spotify.com/search/1/track.json?q=',
	startedMatching: false,
	isMatching: false,

	// as soon as we have a model
	// start matching items with possible spotify items
	startMatching: Ember.observer('model', function() {

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
		Ember.RSVP.all(promises).then(function(/*promise*/) {
			this.set('isMatching', false);
			this.set('doneMatching', true);
		}.bind(this)).catch((/*reason*/) => {
			// if any of the promises fails.
			// console.log(reason);
		});
	}),

	// Matches an item with one from Spotify
	matchItem(item) {
		var url = this.get('endpoint') + encodeURIComponent(item.get('cleanTitle'));

		return Ember.$.getJSON(url).then((response) => {
			var matches = response.tracks;

			// if tracks is empty, there is nothing…
			if (!matches.length) {
				item.set('isMatched', false);
				return false;
			}

			// we found something on spotify!
			item.set('isMatched', true);

			// create a nice array of matches
			var newMatches = matches.map((match) => {
				return this.get('store').createRecord('spotifyItem', {
					artist: match.artists[0].name,
					title: match.name,
					album: match.album.name,
					albumRelease: match.album.released,
					url: match.href,
					playlistItem: item
				});
			});

			// push them
			return matches.pushObjects(newMatches);
		});
	}
});
