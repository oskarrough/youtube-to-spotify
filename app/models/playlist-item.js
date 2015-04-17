import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
	title: DS.attr('string'),
	thumbnail: DS.attr('string'),
	isMatched: DS.attr('boolean'),
	playlist: DS.belongsTo('playlist'),
	matches: DS.hasMany('spotifyItem'),

	// would be nice to also filter out all years except 1999 ??
	cleanTitle: Ember.computed('title', function() {
		return this.get('title').match(/[\w']+/g)
			.join(' ')
			.replace(/official/ig, '')
			.replace(/featuring/ig, '')
			.replace(/feat/ig, '')
			.replace(/video/ig, '')
			.replace(/720p/ig, '')
			.replace(/1080p/ig, '')
			.replace(/version/ig, '')
			.replace(/wmv/ig, '')
			.replace(/7''/ig, '')
			.replace(/12''/ig, '');
	})
});
