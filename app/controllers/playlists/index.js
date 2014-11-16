import Ember from 'ember';

export default Ember.ArrayController.extend({
	needs: ['playlists'],
	playlists: Ember.computed.alias('controllers.playlists'),

	onlyMatched: false,

	doneText: function() {
		return this.get('playlists.doneMatching') ? ' Done.' : '';
	}.property('playlists.doneMatching'),

	matched: function() {
		return this.filterBy('isMatched', true);
	}.property('this.@each.isMatched'),

	// returns the filtered channels if onlyMatched is true
	// otherwise the default array
	items: function() {
		return this.get('onlyMatched') ? this.get('matchedItems') : this;
	}.property('onlyMatched', 'matchedItems'),

	// filters the array with our search value
	matchedItems: function() {
		return this.filterBy('isMatched', true);
	}.property('this.@each.isMatched'),

	actions: {
		afterCopy: function() {
			this.set('didCopy', true);
		}
	}
});
