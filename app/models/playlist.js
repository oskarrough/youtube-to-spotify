import DS from 'ember-data';

export default DS.Model.extend({
	title: DS.attr('string'),
	description: DS.attr('string'),
	thumbnail: DS.attr('string'),
	author: DS.attr('string'),

	// not async because of the localstorage adapter
	items: DS.hasMany('playlistItem')
});
