import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
	location: config.locationType
});

Router.map(function() {
	this.route('about');
	this.resource('playlist', { path: '/p/:playlist_id' }, function() {
		// needed to get an index route
	});
});

export default Router;
