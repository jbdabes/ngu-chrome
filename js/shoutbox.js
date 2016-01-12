$(document).ready(function() {
	/* grab pm list */
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
	
	$('#github_link').click(function(tab){
		chrome.tabs.create({url: 'https://github.com/xijbx/ngusb-chrome'});
	});
});

$(document).ajaxComplete(function(event, xhr, settings) {
	/* fix pm title links */
	$('a.title').each(function(){
		var href = this.href.match(/private.php\?do=showpm\&pmid=(\d+)/);
		$(this).click(function(){
			chrome.tabs.create({url: 'http://www.nextgenupdate.com/forums/private.php?do=showpm&pmid=' + href[1]});
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
});