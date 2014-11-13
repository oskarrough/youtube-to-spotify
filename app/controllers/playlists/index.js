import Ember from 'ember';

export default Ember.ArrayController.extend({
	showMatched: false,

	matched: function() {
		return this.filterBy('isMatched', true);
	}.property('this.@each.isMatched'),

	// returns the filtered channels if showMatched is true
	// otherwise the default array
	items: function() {
		return this.get('showMatched') ? this.get('matchedItems') : this;
	}.property('showMatched', 'matchedItems'),

	// filters the array with our search value
	matchedItems: function() {
		return this.filterBy('isMatched', true);
	}.property('this.@each.isMatched')
});
