import Ember from 'ember';

export default Ember.Route.extend({
	index: 1,
	id: null,
	maxResults: 50,

	model: function(params) {
		this.set('id', params.id);

		// Find the playlist via the YouTube API
		return Ember.$.getJSON(this.get('endpoint')).then(function(response) {

			var playlist = this.get('store').createRecord('playlist', {
				id: params.playlist_id,
				title: response.data.title,
				description: response.data.description,
				thumbnail: response.data.thumbnail.sqDefault,
				author: response.data.author
				// we can not set items here because it's a relationship
			});

			this.set('initialItems', response.data.items);

			return playlist;

		}.bind(this)).fail(function() {
			console.log('fail');
		});
	},

	afterModel: function(model) {
		this.set('model', model);
		this.addItems(this.get('initialItems'));
	},

	addItems: function(items) {

		// Filter out deleted and private videos
		// TODO: couldn't do it with one single filter, don't know why
		var filteredItems = items.filter(function(item) {
			if (item.video.title !== 'Deleted video') {
				return true;
			}
		}).filter(function(item) {
			if (item.video.title !== 'Private video') {
				return true;
			}
		});

		// Convert the remaining to real models
		var itemModels = filteredItems.map(function(item) {
			return this.get('store').createRecord('playlistItem', {
				id: item.video.id,
				title: item.video.title,
				thumbnail: item.video.thumbnail.sqDefault
			});
		}.bind(this));

		// Push them to the playlist
		this.get('model').get('items').pushObjects(itemModels);

		// Try to load more
		this.loadItems();
	},

	// Loads more items depending on global index and max-results in endpoint()
	loadItems: function() {
		this.incrementProperty('index', this.get('maxResults'));
		// console.log('loadItems' + this.get('index'));

		return Ember.$.getJSON(this.get('endpoint')).then(function(response) {
			var items = response.data.items;

			// Break if we have no (more) items
			if (!items) {
				this.set('index', 1);
				return false;
			}

			this.addItems(items);
		}.bind(this));
	},

	// Set endpoint based on ID and current endpoint index
	endpoint: function() {
		return 'https://gdata.youtube.com/feeds/api/playlists/'+ this.get('id') +'?alt=jsonc&v=2&start-index='+ this.get('index') +'&max-results=' + this.get('maxResults');
	}.property('id', 'index'),
});
