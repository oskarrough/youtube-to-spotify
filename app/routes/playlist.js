import Ember from 'ember';

export default Ember.Route.extend({

	// Get correct endpoint URL
	endpoint: function(id) {
		return 'https://gdata.youtube.com/feeds/api/playlists/'+ id +'?alt=jsonc&v=2&start-index=1&max-results=50';
	},
	// beforeModel: function() {
	// },
	model: function(params) {
		return Ember.$.getJSON( this.endpoint(params.playlist_id) )
			.then(function(response) {
				// response.data.items.map(function (item) {
				// 	return App.PlaylistItem.create(item.data);
				// });
				return response.data;
			})
			.fail(function(){
				console.log('fail');
			});
	},
	actions: {
		error: function(error, transition) {
			return this.transitionTo('application');
		}
	}
});
