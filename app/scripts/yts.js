// based on: http://kmturley.blogspot.de/2014/01/converting-youtube-playlists-to-spotify.html
// tunes: PL-tpclp_nA62tdgkqX1hcyKgH_DPp_RSi
// instrumentals: PL6AEA53CDF028371E
// https://gdata.youtube.com/feeds/api/playlists/PL07D6B14E58F50900?alt=jsonc&v=2&start-index=1&max-results=50

var start = 1,
	index = 0,
	matches = [],
	apilimit = 20,

	$analyzed = $('.Analyzed'),
	$success = $('.Success'),
	$failed = $('.Failed'),
	$matches = $('.Matches'),

	$form = $('.Playlist'),
	$input = $('.Playlist-input'),
	$submit = $('.Playlist-submit'),

	$results = $('.Results').hide(),

	$error = $('.js-error'),
	$total = $('.js-total'),
	$title = $('.js-title');

var model = {
    id: null,
	title: '',
	total: 0,
	analyzed: 0,
	matched: 0,
	failed: 0,
	progress: 0,
	matchedPercentage: 0
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
	matches = []; // why?
	loadPage();
});

// Load a YouTube playlist
function loadPage(id) {
	before();

	// Without argument we take the value of the form
	if (!id) {
      console.log('no argument');
		id = $input.val();
	}

	var url = 'https://gdata.youtube.com/feeds/api/playlists/' + id;
	var urlAttributes = '?alt=jsonc&v=2&start-index=' + start + '&max-results=' + apilimit;
	var request = $.get(url + urlAttributes, function (event) {
		console.log('success');
	}).done(function(event) {
		console.log('second success');
		console.log(event);

        if (model.id !== event.data.id) {
          // new playlist
          clearTexts();
          clearResults();
        }

        model.id = event.data.id;
		model.total = event.data.totalItems;
		setTotal(model.total);
		model.title = event.data.title;
		setTitle(model.title);

		if (!event.data.items) {
			console.log('no items');
            onDone();
		} else {
			render(event.data);
		}

	}).fail(function(event) {
		console.log('error');
		onFail();
	}).always(function(event) {
		// console.log('ended');
		onEnd();
	});
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

function after() {
	console.log('after');
	$submit.text('Match').removeAttr('disabled');
	$('body').addClass('is-done').removeClass('is-loading');
	updateCount();
}

function onFail() {
	$('body').addClass('is-failed');
	$('.Results').hide();
	setError('Sorry, didnt find the playlist. Did you enter a correct YouTube playlist ID?');
	after();
}

function onEnd() {
	// console.log('onEnd');
}

function onDone() {
	$('.Progress-status').text('Analyzed');
	$('.js-status').text('Matched');
	$results.show();
	after();
}

function clearTexts() {
	$('.js-error').text('');
}

function clearResults() {
	$('.Bucket').find('li').remove();
}

function render(data) {
	// get and set values
	// data.title
	// data.items.length
	// data.author
	// data.description
	// data.thumbnail.sq

	$results.show();
	renderAnalyzed(data);
	searchSpotify(data.items);
}

function renderAnalyzed(data) {
	for (var i = 0; i < data.items.length; i++) {
		insert(data.items[i].video.title, $analyzed);
		console.log('insert item');
		updateCount();
	}
}

// Search spotify
function searchSpotify(items) {
	// Filter words that Spotify would otherwise choke on
	var name = items[index].video.title || [];
	name = filterName(name);

	// Search for a matching track
	$.get('http://ws.spotify.com/search/1/track.json?q=' + encodeURIComponent(name), function (e) {

		// success
		if (e.tracks && e.tracks[0]) {
			//console.log('success: ', name, e);
			matches.push(e.tracks[0]);
			// console.log(e.tracks[0]);
			// e.tracks[0].name
			// e.tracks[0].artists[0].name
			insert(name, $success);
			insert(e.tracks[0].artists[0].name + ' - ' + e.tracks[0].name + '<small>(' + e.tracks[0].href + ')</small>', $matches);
		// fail
		} else {
			//console.log('fail: ', name, e);
			insert(name, $failed);
		}

		updateCount();

		// recursive until there are no more items
		if (index < items.length - 1) {
			index += 1;
			searchSpotify(items);

		// Otherwise continue searching YouTube (50 results limit)
		} else {
			// console.log(matches);
			start += apilimit;
			index = 0;
			loadPage();
		}
	});
}

function insert(item, container) {
	container.find('.Bucket-results').append('<li>'+ item +'</li>');
}

function updateCount() {
	model.analyzed = $analyzed.find('li').length;
	model.matched = $success.find('li').length;
	model.failed = $failed.find('li').length;

	model.progress = Math.round(model.analyzed / model.total * 100);
	model.matchedPercentage = Math.round(model.matched / model.analyzed * 100);

// 	animateValue('.js-analyzed', model.analyzed, 1000);
// 	animateValue('.js-matched', model.matched, 1000);
// 	animateValue('.js-failed', model.failed, 1000);

	$('.js-analyzed').text(model.analyzed);
	$('.js-matched').text(model.matched);
	$('.js-failed').text(model.failed);

	$('.Progress').width(model.progress + '%');
	$('.Progress-value').text(model.progress + '%');
	// animateValue('.Progress-value', progress, 2000);
}

function setError(msg) {
	$error.text(msg);
}
function setTotal(msg) {
	$total.text(msg);
}
function setTitle(msg) {
	if ($title.text() === '') {
		$title.text(msg);
	}
}

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
	.replace(/7''/ig, '');

	return name;
}

function showSubmit() {
	$submit.addClass('is-visible');
}

function hideSubmit() {
	$submit.removeClass('is-visible');
}

function animateValue(id, end, duration) {
	var obj = $(id)[0];
	var start = $(obj).text();
	var range = end - start;
	// no timer shorter than 50ms (not really visible any way)
	var minTimer = 50;
	// calc step time to show all interediate values
	var stepTime = Math.abs(Math.floor(duration / range));

	// never go below minTimer
	stepTime = Math.max(stepTime, minTimer);

	// get current time and calculate desired end time
	var startTime = new Date().getTime();
	var endTime = startTime + duration;
	var timer;

	function run() {
		var now = new Date().getTime();
		var remaining = Math.max((endTime - now) / duration, 0);
		var value = Math.round(end - (remaining * range));
		obj.innerHTML = value;
		if (value == end) {
			clearInterval(timer);
		}
	}

	timer = setInterval(run, stepTime);
	run();
}
