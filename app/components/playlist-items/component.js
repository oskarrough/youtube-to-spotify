import Ember from 'ember';

export default Ember.Component.extend({

	// needs: ['playlist'],
	// playlist: Ember.computed.alias('controllers.playlist'),

	showMatched: true,

	// returns all matched items
	matched: function() {
		return this.get('items').filterBy('isMatched', true);
	}.property('items.@each.isMatched'),

	// returns either the matched items or all
	filteredItems: function() {
		return this.get('showMatched') ? this.get('matched') : this.get('items');
	}.property('showMatched', 'matched'),

	// Updates UI according to state
	// todo: could also be in the template…
	// doneText: function() {
	// 	return this.get('playlist.doneMatching') ? ' Done.' : '';
	// }.property('playlist.doneMatching'),

	actions: {

		// after 'zero-clipboard-copy'
		afterCopy() {
			this.set('didCopy', true);
		}
	}
});
