import Ember from 'ember';

export default Ember.Controller.extend({
	needs: ['playlist'],
	playlist: Ember.computed.alias('controllers.playlist'),
	showMatched: true,

	// returns all matched items
	matched: function() {
		return this.get('model').filterBy('isMatched', true);
	}.property('model.@each.isMatched'),

	// returns either the content or filtered content
	filteredModel: function() {
		return this.get('showMatched') ? this.get('matched') : this.get('model');
	}.property('showMatched', 'matched'),

	// Updates UI according to state
	// todo: could also be in the template…
	doneText: function() {
		return this.get('playlist.doneMatching') ? ' Done.' : '';
	}.property('playlist.doneMatching'),

	actions: {
		// after 'zero-clipboard-copy'
		afterCopy: function() {
			this.set('didCopy', true);
		}
	}
});
