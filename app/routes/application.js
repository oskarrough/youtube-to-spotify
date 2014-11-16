import Ember from 'ember';

export default Ember.Route.extend({
	actions: {
		convertPlaylist: function() {
			var id = this.controllerFor('index').get('playlist');
			if (!id) { return false; }

			console.log(id);
			this.transitionTo('playlists', id);
		}
	}
});
