import Ember from 'ember';

var Router = Ember.Router.extend({
  location: YtsENV.locationType
});

Router.map(function() {
	this.resource('playlist', { path: '/playlist/:playlist_id' });
	// this.resource('error');
});

export default Router;
