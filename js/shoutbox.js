$(document).ready(function() {
	$('#jb_link').click(function(tab){
		chrome.tabs.create({url: 'http://www.nextgenupdate.com/forums/members/116424-jb.html'});
	});
	$('#github_link').click(function(tab){
		chrome.tabs.create({url: 'https://github.com/xijbx/ngusb-chrome'});
	});
});