var xhrMethod;
var xhrPmid;
var currentTab;
var openTabs = [];

$(function () {

    //when ever any tab is clicked this method will be call
    $("#myTab").on("click", "a", function (e) {
        // e.preventDefault();

        $(this).tab('show');
        $currentTab = $(this);
    });

    registerCloseEvent();
});

$(document).ready(function() {
	/* grab pm list */
	xhrMethod = 'pmlist';
	$('#pm_input').load('http://www.nextgenupdate.com/forums/private.php #pmfolderlist');

	/* fix links */
	$('a.title').each(function(){
		console.log('start');
		var href = this.href.match(/private.php\?do=showpm\&pmid=(\d+)/);
		//chrome.tabs.create({url: 'http://www.nextgenupdate.com/forums/private.php?do=showpm&pmid=' + href[1]});
		this.href = 'http://www.nextgenupdate.com/forums/private.php?do=showpm&pmid=' + href[1];
		console.log('executed');
	});

	/* about links */
	$('#jb_link').click(function(tab){
		chrome.tabs.create({url: 'http://www.nextgenupdate.com/forums/members/116424-jb.html'});
	});

	$('#megalelz_link').click(function(tab){
		chrome.tabs.create({url: 'http://www.nextgenupdate.com/forums/members/796679-megalelz.html'});
	});
	
	$('#github_chrome_link').click(function(tab){
		chrome.tabs.create({url: 'https://github.com/xijbx/ngusb-chrome'});
	});

	$('#github_firefox_link').click(function(tab){
		chrome.tabs.create({url: 'https://github.com/MEGALELZ/ngusb'});
	});

	$('#ngu_thread_link').click(function(tab){
		chrome.tabs.create({url: 'http://www.nextgenupdate.com/forums/internet-talk/880108-ngu-shoutbox-extension-chrome.html'});
	});

	$('#ngu_changelog_link').click(function(tab){
		chrome.tabs.create({url: 'http://www.nextgenupdate.com/forums/internet-talk/880108-ngu-shoutbox-extension-chrome-post6867294.html#post6867294'});
	});

	registerCloseEvent();
});

$(document).ajaxComplete(function(event, xhr, settings) {
	if (xhrMethod == 'pmlist') {
		/* fix pm title links */
		$('a.title').each(function(){
			var href = this.href.match(/private.php\?do=showpm\&pmid=(\d+)/);
			var title = this.innerHTML;
			$(this).click(function(){
				//chrome.tabs.create({url: 'http://www.nextgenupdate.com/forums/private.php?do=showpm&pmid=' + href[1]});
				openPrivateMessage(href[1], title);
			});
			this.href = '#';
		});

		/* fix pm sender links */
		$('a.username.understate').each(function(){
			var href = this.href.match(/members\/(.*)\.html/);
			$(this).click(function(){
				chrome.tabs.create({url: 'http://www.nextgenupdate.com/forums/members/' + href[1] + '.html'});
			});
			this.href = '#';
		});
	} else if (xhrMethod == 'loadpm') {
		$('#pm_' + xhrPmid + '_tab a').click();
		/* close pm tabs */
		registerCloseEvent();

		/* fix avatar srcs & hrefs */
		registerFixAvatars(xhrPmid);

		/* fix smilies */
		registerFixSmilies(xhrPmid);

		/* register form event handler */
		registerFormEventHandler(xhrPmid);
	}
});

function openPrivateMessage(pmid, title)
{
	/* check if it's already open */
	if (openTabs.indexOf(pmid) < 0) {
		/* add tabid to open tabs array */
		openTabs.push(pmid);

		/* create tab element */
		var newTab = "<li id=\"pm_" + pmid + "_tab\"><a data-toggle=\"tab\" href=\"#pm_" + pmid + "_body\"><button class=\"close closeTab\" data-pmid=\"" + pmid + "\" type=\"button\" >&times;</button><i class=\"fa fa-lg fa-fw fa-envelope-o\"></i> " + title + "</a></li>";
		$('#tab-bar').append(newTab);

		/* create tab content */
		var newTabContent = "<div id=\"pm_" + pmid + "_body\" class=\"tab-pane fade\"><div id=\"pm_" + pmid + "_content\"></div></div>";
		$('#tab-container').append(newTabContent);

		/* load in the private message form */
		$('#pm_' + pmid + '_content').load('http://www.nextgenupdate.com/forums/private.php?do=showpm&pmid=' + pmid + ' div#showpm');

		/* auto switch to new pm tab */
		xhrMethod = 'loadpm';
		xhrPmid = pmid;
	}
}

function registerFixAvatars(pmid) {
	var avatarSrc = $('#pm_' + pmid + '_content .postuseravatar .img-circle').attr('src');
	if (avatarSrc.match(/http\:\/\//)) {
		// continue
	} else {
		$('#pm_' + pmid + '_content .postuseravatar .img-circle').attr('src', 'http://www.nextgenupdate.com/forums/' + avatarSrc);
	}

	var avatarUrl = $('#pm_' + pmid + '_content .postuseravatar').attr('href');
	avatarUrl = 'http://www.nextgenupdate.com/forums/' + avatarUrl;
	$('#pm_' + pmid + '_content .postuseravatar').click(function(){
		chrome.tabs.create({url: avatarUrl});
	});

	registerFixUsername('#pm_' + pmid + '_content .postuseravatar');
}

function registerFixUsername(selector) {
	var $element = $(selector).next().next();
	var usernameUrl = $element.attr('href');
	usernameUrl = 'http://www.nextgenupdate.com/forums/' + usernameUrl;
	$element.click(function(){
		chrome.tabs.create({url: usernameUrl});
	});
}

function registerFixSmilies(pmid) {
	var smilieUrl = $('#pm_' + pmid + '_content img.inlineimg').attr('src');
	$('#pm_' + pmid + '_content img.inlineimg').attr('src', 'http://www.nextgenupdate.com/forums/' + smilieUrl);
}

function registerCloseEvent() {
    $(".closeTab").click(function () {
        // there are multiple elements which has .closeTab icon so close the tab whose close icon is clicked
        var tabContentId = $(this).parent().attr("href");
        var pmid = $(this).attr('data-pmid');
        var positionInArray = openTabs.indexOf(pmid);
        openTabs.splice(positionInArray, 1);
        $(this).parent().parent().remove(); // remove li of tab
        $(tabContentId).remove(); // remove respective tab content
        $('#messages-tab a').tab('show'); // show messages tab
    });
}

function registerFormEventHandler(pmid) {
	$('#pm_' + pmid + '_content form').submit(function(){
		$('#pm_' + pmid + '_tab a button').click();
	});
}



