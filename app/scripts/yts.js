// tunes: PL-tpclp_nA62tdgkqX1hcyKgH_DPp_RSi
// instrumentals: PL6AEA53CDF028371E
// https://gdata.youtube.com/feeds/api/playlists/PL07D6B14E58F50900?alt=jsonc&v=2&start-index=1&max-results=50

var start = 1,
	index = 0,
	apilimit = 50,

	$analyzed = $('.Analyzed'),
	$success = $('.Success'),
	$failed = $('.Failed'),
	$matches = $('.Matches'),

	$form = $('.PlaylistForm'),
	$input = $('.PlaylistForm-input'),
	$submit = $('.PlaylistForm-submit'),

	$results = $('.Results'),

	$error = $('.js-error'),
	$total = $('.js-total'),
	$title = $('.js-title');

var model = {
	id: null,
	title: '',
	total: 0,

	analyzed: [],
	success: [],
	failed: [],

	progress: 0,
	successPercentage: 0
};

// Toggle the button depending on the input
$input.on('focus keyup change', function (event) {
	if (this.value !== '') {
		showSubmit();
	} else {
		hideSubmit();
	}
});

$form.on('submit', function (event) {
	event.preventDefault();
	index = 0; // why?
	model.id = $input.val();
	loadPage();
});

$('.js-toggleFailed').on('click', function (event) {
	event.preventDefault();
	$('.Failed').toggle();
});
$('.js-toggleTitles').on('click', function (event) {
	event.preventDefault();
	$('.Bucket-results').toggleClass('is-showingTitles');
});

// Load a YouTube playlist
function loadPage(id) {
	before();

	var id = model.id;

	var url = 'https://gdata.youtube.com/feeds/api/playlists/' + id;
	var urlAttributes = '?alt=jsonc&v=2&start-index=' + start + '&max-results=' + apilimit;
	var request = $.get(url + urlAttributes, function (event) {
		console.log('success');

	}).done(function(event) {
		// console.log('second success');
		// console.log(event);

		if (model.id !== event.data.id) {
			// new playlist
			clearTexts();
			clearResults();
		}

		// onDone();

		if (!event.data.items) {
			console.log('no items');
			$submit.text('Converting');

		} else {
			render(event.data);
		}

	}).fail(function(event) {
		console.log('error');
		onFail();

	}).always(function(event) {});
}

// note this is called several times while loading
// should actually only be called once
function before() {
	console.log('before');
	clearTexts();
	$('.Progress-status').text('Analyzing');
	$submit.text('Loading').attr('disabled', 'disabled');
	$('body').removeClass('is-failed').removeClass('is-done').addClass('is-loading');
}

function onFail() {
	$('body').addClass('is-failed');
	$('.Results').hide();
	setError('Sorry, didnt find the playlist. Did you enter a correct YouTube playlist ID?');
	after();
}

function onDone() {
	$('.Progress-status').text('Analyzed');
	$('.js-status').text('Converted');
	$results.show();
	after();
}

function after() {
	console.log('after');
	$submit.text('Convert').removeAttr('disabled');
	$('body').addClass('is-done').removeClass('is-loading');
}

function render(data) {
	$results.show();

	// get and set title and total on the model
	model.id = data.id;
	model.total = data.totalItems;
	model.title = data.title;
	setTotal(model.total);
	setTitle(model.title);

	// Try to match all tracks with Spotify
	for (var i = 0; i < data.items.length; i++) {
		index += 1;

		var item = data.items[i];
		var name = item.video.title;
		// var name = item.video.title || [];
		searchSpotify(name);
	}

	console.log('Done searching YouTube from ' + start);

	// Continue searching YouTube (50 results limit)
	start += apilimit;
	index = 0;
	loadPage();
}

// Search for a matching track
function searchSpotify(name) {
	var filteredName = filterName(name);

	var url = 'http://ws.spotify.com/search/1/track.json?q=' + encodeURIComponent(filteredName);
	var request = $.get(url, function (event) {
		console.log('spotify started');

	}).done(function(event) {
		// console.log('spotify: done');
		model.analyzed.push(name);
		matchTrack(filteredName, event.tracks[0]);

	}).fail(function(event) {
		console.log('spotify: fail');

	}).always(function(event) {
		// console.log('spotify: always');
	});
}

function matchTrack(name, track) {
	if (track) {
		model.success.push(track);
		// insert(track.artists[0].name + ' - ' + track.name + '<small>(' + track.href + ')</small>', $success);
		insert(track.href + '<small>(' + track.artists[0].name + ' - ' + track.name + ')</small>', $success);
	} else {
		model.failed.push(name);
		insert(name, $failed);
	}

	updateCount();
}

function updateCount() {
	model.progress = Math.round(model.analyzed.length / model.total * 100);
	// model.successPercentage = Math.round(model.success.length / model.analyzed * 100);

	// console.log('Analyzed ' + model.analyzed.length + '/' + model.total);
	// console.log('Analyzed ' + model.analyzed + '/' + model.total);

	// animateValue('.js-analyzed', model.analyzed, 1000);
	// animateValue('.js-success', model.success, 1000);
	// animateValue('.js-failed', model.failed, 1000);

	// DONE!!
	if (model.progress === 100) {
		onDone();
	}

	// console.log('updateCount:' + model.success.length);

	// $('.js-analyzed').text(model.analyzed);
	$('.js-success').text(model.success.length);
	$('.js-failed').text(model.failed.length);
	$('.Progress').width(model.progress + '%');
	$('.Progress-value').text(model.progress + '%');
	// animateValue('.Progress-value', progress, 2000);
}

function insert(item, container) {
	container.find('.Bucket-results').append('<li>'+ item +'</li>');
}

function clearTexts() {
	$('.js-error').text('');
}

function clearResults() {
	$('.Bucket').find('li').remove();
}

function setError(msg) {
	$error.text(msg);
}
function setTotal(msg) {
	$total.text(msg);
}
function setTitle(msg) {
	$title.text(msg);
}

function showSubmit() {
	$submit.addClass('is-visible');
}

function hideSubmit() {
	$submit.removeClass('is-visible');
}

// would be nice to also filter out all years except 1999
function filterName(name) {
	name = name.match(/[\w']+/g)
	.join(' ')
	.replace(/official/ig, '')
	.replace(/featuring/ig, '')
	.replace(/feat/ig, '')
	.replace(/video/ig, '')
	.replace(/720p/ig, '')
	.replace(/1080p/ig, '')
	.replace(/version/ig, '')
	.replace(/wmv/ig, '')
	.replace(/7''/ig, '');

	return name;
}
