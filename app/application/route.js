import Ember from 'ember';

export default Ember.Route.extend({
	actions: {
		convert: function() {
			var id = this.controllerFor('index').get('playlistId');

			this.transitionTo('playlist', id);
		}
	}
});
