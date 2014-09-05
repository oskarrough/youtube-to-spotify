import Ember from 'ember';

var Router = Ember.Router.extend({
  location: YtsENV.locationType
});

Router.map(function() {
	this.route('convert');
	this.resouce('playlists');
	this.resource('playlist', { path: '/playlist/:playlist_id' });
});

export default Router;
