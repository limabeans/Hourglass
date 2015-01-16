//LISTENER: listening for when the user clicks on the icon
chrome.browserAction.onClicked.addListener(function() {
    timelogNewTab();
});

//function that is responsible for creating the new tab
timelogNewTab = function() {
    chrome.tabs.create({
	url: "./timelog.html",
	active: true
    });
};

//Updated vs Activated Listeners
//UPDATED: when you change the url, tends to be called more than once
//ACTIVATED: when one switches to tab

//LISTENER: onUpdated listener
chrome.tabs.onUpdated.addListener( function(tabId, changeInfo, tab) {
    updateList(tab.title);
    console.log('updated' + tab.title + ' ' + Date.now());
});

//LISTENER: onActivated listener
chrome.tabs.onActivated.addListener(function(activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function(tab) {
	updateList(tab.title);
	console.log('activated' + tab.title + ' ' + Date.now());
    });
});

//function responsible for updating the list in timelog.html
updateList = function(title) {
    var time = new Date();
    var txt = time.getHours() + ':' + time.getMinutes() +
	' - ' + title;
    //sends a message to timelog.js
    chrome.runtime.sendMessage({
	div: 'list',
	elemType: 'li',
	text: txt
    });
};

