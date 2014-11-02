import Ember from 'ember';

export default Ember.Route.extend({
	model: function(params) {
		var playlist = Ember.Object.create();

		this.set('index', 1);
		this.set('id', params.playlist_id);

		return Ember.$.getJSON(this.get('endpoint')).then(function(response) {
			console.log(response.data);

			// author, totalItems, itemsPerPage

			playlist.setProperties({
				'id': params.playlist_id,
				'title': response.data.title,
				'description': response.data.description,
				'thumbnail': response.data.thumbnail,
				'items': response.data.items
			});

			// response.data.items.map(function (item) {
			// 	return App.PlaylistItem.create(item.data);
			// });

			return playlist;
		})
		.fail(function() {
			console.log('fail');
		});
	},

	// Set endpoint based on ID and current endpoint index
	endpoint: function() {
		return 'https://gdata.youtube.com/feeds/api/playlists/'+ this.get('id') +'?alt=jsonc&v=2&start-index='+ this.get('index') +'&max-results=50';
	}.property('index', 'id'),

	// Recursively find all items in a playlist
	afterModel: function(model) {
		this.loadItems(model);
	},

	// Loads more items depending on global index and max-results in endpoint()
	loadItems: function(model) {
		this.incrementProperty('index', 50);
		console.log('loadItems' + this.get('index'));
		Ember.$.getJSON(this.get('endpoint')).then(function(response) {
			var items = response.data.items;
			if (items) {
				model.get('items').pushObjects(items);
				this.loadItems(model);
			} else {
				// reset
				this.set('index', 1);
				return false;
			}
		}.bind(this));
	}
});
