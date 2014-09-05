import Ember from 'ember';

export default Ember.Route.extend({
	model: function(params) {
		var url = 'https://gdata.youtube.com/feeds/api/playlists/'+ params.playlist_id +'?alt=jsonc&v=2&start-index=1&max-results=50';
		return Ember.$.getJSON(url).then(function(data) {
			console.log(data.data);
			return data.data.items;
			// return data.splice(0, 3);
		});

		// return [{
		// 	title: "Tomster",
		// 	url: "http://emberjs.com/images/about/ember-productivity-sm.png"
		// }, {
		// 	title: "Eiffel Tower",
		// 	url: "http://emberjs.com/images/about/ember-structure-sm.png"
		// }];
	  }
});




// // Try to match all tracks with Spotify
// for (var i = 0; i < data.items.length; i++) {
// 	var item = data.items[i];
// 	var name = item.video.title;
// 	// var name = item.video.title || [];
// 	searchSpotify(name);
// }

// console.log('Done searching YouTube from ' + start);

// // Continue searching YouTube (50 results limit)
// start += apilimit;
// if (start < 1000) {
// 	loadPage();
// } else {
// 	console.log('youtube 1000 limit reached');
// }
