import Ember from 'ember';

export default Ember.ObjectController.extend({
	needs: ['playlists/index'],
	playlistsIndex: Ember.computed.alias('controllers.playlists/index'),
	isMatching: false,
	endpoint: 'http://ws.spotify.com/search/1/track.json?q=',

	actions: {
		match: function() {
			if (this.get('isMatching')) { return; }

			this.set('startedMatching', true);
			this.set('isMatching', true);
			this.get('playlistsIndex').set('onlyMatched', true);

			var promises = this.get('model.items').map(function(item) {
				Ember.debug('map');
				return this.matchItem(item);
			}.bind(this));

			Ember.RSVP.all(promises).then(function(/*promise*/) {
				// results contains an array of results for the given promises
				this.set('isMatching', false);
				this.set('doneMatching', true);
			}.bind(this)).catch(function(/*reason*/){
				// if any of the promises fails.
				// console.log(reason);
			});
		}
	},

	// Matches an item with one from Spotify
	matchItem: function(item) {
		var _this = this;
		var url = this.get('endpoint') + encodeURIComponent(item.get('cleanTitle'));

		return Ember.$.getJSON(url).then(function(response) {
			var matches = response.tracks;

			// if tracks is empty, there is nothing…
			if (!matches.length) {
				item.set('isMatched', false);
				return false;
			}

			// we found something on spotify!
			item.set('isMatched', true);

			// create a nice array of matches
			var newMatches = matches.map(function(match) {
				return _this.get('store').createRecord('spotifyItem', {
					artist: match.artists[0].name,
					title: match.name,
					album: match.album.name,
					albumRelease: match.album.released,
					url: match.href,
					playlistItem: item
				});
			});

			// push them to the item
			matches.pushObjects(newMatches);

			return true;
		});
	}
});
