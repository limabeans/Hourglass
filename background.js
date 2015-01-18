//Holds the current entry.
//If currEntry is null, that means that either Hourglass
//just started running, or that the user has visited an
//'ignoreTheseWebsites' page, and currEntry has been nullified.
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
//When the user changes url. Tends to be called multiple times.
chrome.tabs.onUpdated.addListener( function(tabId, changeInfo, tab) {
    //Don't want to be concerned with websites that aren't loaded.
    if(changeInfo.status === 'complete') {
	processTabChanges(tab);
    }
});

//Listener: onActivated 
//When the user switches tabs.
chrome.tabs.onActivated.addListener(function(activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function(tab) {
	processTabChanges(tab);
    });
});

var processTabChanges = function(tab) {
    var domain = (new URI(tab.url)).hostname();
    var entry = new Entry(new Date(), 0,
			  domain, tab.url, tab.title); 
    if(currEntry==null) {
	if(!ignoreTheseWebsites(tab)) {
	    currEntry=entry;
	    console.log('denullified- ' + currEntry.title);
	} 
	//Otherwise, currEntry remains as null.
    } else if(entry.url !== currEntry.url) {
	//Temporary ended Date object.
	var ended = new Date();
	//Ensure that currEntry.ended is of type String.
	currEntry.ended = Date(ended);
	
	//Calculate total time.
	var startMillis = (new Date(currEntry.started)).getTime();
	var endMillis = ended.getTime();
	currEntry.totalTime = endMillis - startMillis;
	//!! BUG. Adding new tabs unfortunately... sometimes.?
	updateDatabase(currEntry);
	console.log('[TAB processed]');

	//But that url might not be worth making 
	//a new entry for.
	if(!ignoreTheseWebsites(tab)) {
	    currEntry = entry;

	} else {
	    currEntry = null;
	}
    }
};


//Function responsible for sending a package of entryObject details.
updateDatabase = function(entryObj) {
    //Not sure yet why I couldn't have declared this globally.
    //Was getting a port disconnected error.
    var entryPort = chrome.runtime.connect({name: 'entryPort'});    
    //Now sending package through entryPort for database.js
    entryPort.postMessage(entryObj);
};



ignoreTheseWebsites = function(tab) {
    if(tab.title === 'Hourglass' || tab.title === 'Extensions' ||
       tab.title === 'Hourglass Settings' ||
       tab.url === 'chrome://newtab/' || tab.title === 'New Tab' || 
       tab.title === 'Loading...') {
	console.log('A website was ignored from logging.');
	return true;
    }
    return false;
};

//starte and ended Objects become dead once sent through Port.
function Entry(created, totTime, d, u, t) {
    this.key = created.getTime();
    //Ensure that this.started is of type String.
    this.started = Date(created); 
    this.ended = null;
    this.totalTime = totTime;
    this.domain = d;
    this.url = u;
    this.title = t;
    //Note: IndexedDB will not store the functions of an object.
    this.toString = function() {
	var str = this.key+' ('+this.totalTime+'ms) - ' + 
	    this.domain;
	return str;
    };
}

