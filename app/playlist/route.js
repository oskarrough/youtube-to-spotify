import Ember from 'ember';

export default Ember.Route.extend({
	index: 1,
	id: null,
	maxResults: 50,

	// Set endpoint based on ID and current endpoint index
	endpoint: Ember.computed('id', 'index', function() {
		return 'https://gdata.youtube.com/feeds/api/playlists/'+ this.get('id') +'?alt=jsonc&v=2&start-index='+ this.get('index') +'&max-results=' + this.get('maxResults');
	}),

	// Returns a playlist
	model: function(params) {
		this.set('id', params.id);

		console.log('model hook');

		// Find the playlist via the YouTube API
		return Ember.$.getJSON(this.get('endpoint'))
			.then((response) => {
				return this.get('store').createRecord('playlist', {
					id: params.playlist_id,
					title: response.data.title,
					description: response.data.description,
					thumbnail: response.data.thumbnail.sqDefault,
					author: response.data.author,
					rawItems: response.data.items
				});

		}).fail(function() {
			console.log('fail');
		});
	},

	afterModel(model) {
		console.log('afterModel hook');

		// // todo: because currentModel seems to be undefined…
		this.set('model', model);

		// convert the raw items to ember models
		// Ember.run.next(() => {
			model.get('rawItems').forEach((item) => {
				this.createPlaylistItem(item);
			});
		// });

		// Try to load more
		this.fetchMoreItems();
	},

	createPlaylistItem(item) {
		let status = item.video.status;

		// filter out rejected and private
		if (status) {
			if (status.value === 'rejected') {
				return false;
			}
			if (status.reason === 'private') {
				return false;
			}
		}

		// Filter out deleted
		if (item.video.title === 'Deleted video') {
			return false;
		}

		// Convert the remaining to real models
		let playlistItem = this.store.createRecord('playlistItem', {
			id: item.video.id,
			title: item.video.title,
			thumbnail: item.video.thumbnail.sqDefault
		});

		// Push them to the playlist
		this.get('model.items').addObject(playlistItem);
	},

	// Loads more items depending on global index and max-results in endpoint()
	fetchMoreItems() {

		// this updates our endpoint to fetch the next batch
		this.incrementProperty('index', this.get('maxResults'));

		return Ember.$.getJSON(this.get('endpoint')).then((response) => {
			var items = response.data.items;

			// Break if we have no (more) items
			if (!items) {
				this.set('index', 1);
				console.log('breaking');
				return false;
			}

			items.forEach((item) => {
				this.createPlaylistItem(item);
			});

			// Try to load more
			this.fetchMoreItems();
		});
	}
});
