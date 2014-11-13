import Ember from 'ember';

export default Ember.Route.extend({
	// Set the model to the items of the parent playlist route
	model: function() {
		return this.modelFor('playlists').get('items');
	}
});
