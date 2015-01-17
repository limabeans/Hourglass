//Updated vs Activated Listeners
//Updated: when you change the url, tends to be called more than once
//Activated: when one switches to tab

//Listener: listening for when the user clicks on the icon
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

//Listener: onUpdated listener
chrome.tabs.onUpdated.addListener( function(tabId, changeInfo, tab) {
    updateList(tab.title);
    console.log('[updated] ' + tab.title + ' ' + Date.now());
});

//Listener: onActivated listener
chrome.tabs.onActivated.addListener(function(activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function(tab) {
	updateList(tab.title);
	console.log('[activated] ' + tab.title + ' ' + Date.now());
    });
});


//function responsible for updating the list in timelog.html
updateList = function(title) {
    var time = new Date();
    var txt = time.getHours() + ':' + time.getMinutes() +
	' - ' + title;
    //Not sure yet why I couldn't have declared this globally.
    //Was getting a port disconnected error.
    var logPort = chrome.runtime.connect({name: 'timelog'});    
    //Now sending all logs through logPort.
    logPort.postMessage({
	div: 'list',
	elemType: 'li',
	text: txt
    });
};

