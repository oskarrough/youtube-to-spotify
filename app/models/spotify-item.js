import DS from 'ember-data';

export default DS.Model.extend({
	artist: DS.attr('string'),
	title: DS.attr('string'),
	album: DS.attr('string'),
	albumRelease: DS.attr('string'),
	url: DS.attr('string'),
	playlistItem: DS.belongsTo('playlistItem')
});
