//Holds the current entry.
//If currEntry is null, that means that either Hourglass
//just started running, or that the user has visited an
//'ignoreThisWebsite' page, and currEntry has been nullified.
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
    var entry = new Entry(new Date(), 0,
			  'top domain here', 
			  tab.url, tab.title );
    if(currEntry==null) {
	if(!ignoreTheseWebsites(tab)) {
	    currEntry=entry;
	    console.log('denullified- ' + currEntry.title);
	} 
	//Otherwise, currEntry remains as null.
    } else if(entry.url !== currEntry.url) {
	//This means that they switched tabs.
	currEntry.ended = new Date();
	var startMillis = currEntry.started.getTime();
	var endMillis = currEntry.ended.getTime();
	currEntry.totalTime = endMillis - startMillis;

	updateDatabase(currEntry);

	console.log('[activated]');
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
    // var txt = entryObj.started + ' - ' +
    // 	entryObj.totalTime + 'ms - ' + entryObj.domain + 
    // 	' - ' + ' - ' + entryObj.url + 
    // 	' - ' + entryObj.title;
    var txt = entryObj.toString();
    //Not sure yet why I couldn't have declared this globally.
    //Was getting a port disconnected error.
    var entryPort = chrome.runtime.connect({name: 'entryPort'});    
    //Now sending package through entryPort for database.js
    entryPort.postMessage(entryObj);
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

//starte and ended Objects become dead once sent through Port.
function Entry(created, totTime, d, u, t) {
    this.key = created.getTime();
    this.started = created; 
    this.ended = null;
    this.totalTime = totTime;
    this.domain = d;
    this.url = u;
    this.title = t;
    //Note: IndexedDB will not store the functions of an object.
    this.toString = function() {
	var str = this.key+' ('+this.totalTime+'ms) - ' + 
	    this.url;
	return str;
    };
}
