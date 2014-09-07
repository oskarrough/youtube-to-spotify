import Ember from 'ember';

export default Ember.Route.extend({
	actions: {
		go: function() {
			var id = this.controllerFor('application').get('playlistID');
			this.transitionTo('playlist', id);
		}
	}
});
