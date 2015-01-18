//Holds the current entry.
var currEntry = null;

//Listener: listening for when the user clicks on the icon
//and creates new tab
chrome.browserAction.onClicked.addListener(function() {
    chrome.tabs.create({
	url: "./timelog.html",
	active: true
    });
});


//Listener: onUpdated 
//When the user changes url, tends to be called multiple times.
chrome.tabs.onUpdated.addListener( function(tabId, changeInfo, tab) {
    //Don't want to be concerned with websites that aren't loaded.
    if(changeInfo.status === 'complete' && !ignoreTheseWebsites(tab)) {
	var entry = new Entry(new Date(), 0,
			      'top domain here', 'tag', 
			      tab.url, tab.title );
	if(currEntry==null) {
	    currEntry=entry;
	}
	
	updateList(entry);
	console.log('[updated]');
    }
});

//Listener: onActivated 
//When the user switches tabs.
chrome.tabs.onActivated.addListener(function(activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function(tab) {
	if(ignoreTheseWebsites(tab)) {
	    return;
	}
	var entry = new Entry(new Date(), 0,
			      'top domain here', 'tag', 
			      tab.url, tab.title );

	if(currEntry==null) {
	    currEntry=entry;
	}

	updateList(entry);
	console.log('[activated]');
    });
});


//Function responsible for updating the list in timelog.html.
updateList = function(entry) {
    var txt = entry.dateOfCreation + ' - ' +
	entry.totalTime + ' - ' + entry.domain + 
	' - ' + entry.tag + ' - ' + entry.url + 
	' - ' + entry.title;
    //Not sure yet why I couldn't have declared this globally.
    //Was getting a port disconnected error.
    var logPort = chrome.runtime.connect({name: 'timelog'});    
    //Now sending all logs through logPort.
    logPort.postMessage({
	div: 'list',
	elemType: 'li',
	text: txt
    });
    console.log('CURR ENTRY ' + currEntry.title);
};

ignoreTheseWebsites = function(tab) {
    if(tab.title === 'Time Log' || tab.title === 'Extensions' ||
       tab.url === 'chrome://newtab/' || tab.title === 'New Tab' || 
      tab.title === 'Loading...') {
	console.log('A website was ignored from logging.');
	return true;
    }
    return false;
};

function Entry(dateOfCreate, totTime, domai, ta, ur, tit) {
    this.dateOfCreation = dateOfCreate;
    this.totalTime = totTime;
    this.domain = domai;
    this.tag = ta;
    this.url = ur;
    this.title = tit;
}
