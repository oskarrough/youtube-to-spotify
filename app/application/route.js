import Ember from 'ember';

export default Ember.Route.extend({

	actions: {

		transition() {
			var id = this.controllerFor('index').get('playlistId');
			this.transitionTo('playlist', id);
		}
	}
});
