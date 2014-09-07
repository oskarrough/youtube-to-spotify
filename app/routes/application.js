import Ember from 'ember';

export default Ember.Route.extend({
	actions: {
		convertPlaylist: function() {
			var id = this.controllerFor('index').get('playlist');
			this.transitionTo('playlist', id);
		}
	}
});
