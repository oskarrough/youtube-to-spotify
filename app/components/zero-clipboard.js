// import Ember from 'ember';
import ZeroClipboard from 'ember-cli-zero-clipboard/components/zero-clipboard';

export default ZeroClipboard.extend({
	actions: {

		// this gets triggered after the copy event
		afterCopy() {
			console.log('afterCopy');
			this.sendAction();
		}
	}
});
