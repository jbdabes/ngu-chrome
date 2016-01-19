var xhrMethod;
var xhrPmid;
var currentTab;

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

	/* footer links */
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
		// $('#pm_' + xhrPmid + '_tab a i.close_pm_tab').click(function(){
		// 	var thisPmid = xhrPmid;
		// 	$('#messages-tab').click();
		// 	$('#pm_' + thisPmid + '_body').remove();
		// 	$('#pm_' + thisPmid + '_tab').remove();
		// });
	}
});

function openPrivateMessage(pmid, title)
{
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

function registerCloseEvent() {

    $(".closeTab").click(function () {

        //there are multiple elements which has .closeTab icon so close the tab whose close icon is clicked
        var tabContentId = $(this).parent().attr("href");
        $(this).parent().parent().remove(); //remove li of tab
        $(tabContentId).remove(); //remove respective tab content
        $('#messages-tab a').tab('show'); // Select messages tab
    });
}





