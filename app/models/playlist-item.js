import DS from 'ember-data';

export default DS.Model.extend({
	title: DS.attr('string'),
	spotifyTitle: DS.attr('string'),
	thumbnail: DS.attr('string'),
	isMatched: DS.attr('boolean'),
	playlist: DS.belongsTo('playlist')
});
