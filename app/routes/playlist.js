import Ember from 'ember';

export default Ember.Route.extend({
	model: function(params) {
		var self = this;
		var url = 'https://gdata.youtube.com/feeds/api/playlists/'+ params.playlist_id +'?alt=jsonc&v=2&start-index=1&max-results=50';

		return Ember.$.getJSON(url).then(function(data) {
			console.log(data.data);
			return data.data;
		}).fail(function(){
			self.transitionTo('playlist/not-found');
		});
	}
});
