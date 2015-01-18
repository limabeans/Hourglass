//indexedDB.deleteDatabase('dbase') to restart.
//Global variable for database. 
//Probably have to refactor this sometime.
var entryDatabase;
var wipe = function() {
    indexedDB.deleteDatabase('entryDatabase');
    console.log('entryDatabase wiped');
    //Reload the page, ignore cache.
    location.reload(true);
};

var initDatabase = function(name, version) {
    var request = indexedDB.open(name, version);
    request.onerror = function(e) {
	console.log('Error creating database: ' +
		    name + ' v' + version);
    };
    request.onsuccess = function(e) {
	entryDatabase = e.target.result;
	console.log(entryDatabase);
	console.log('Successfully initialized ' + 
		    name + ' v' + version);
    };
    request.onupgradeneeded = function(e) {
	console.log('Upgrade on ' + name + '. version: ' +
		    version);
	var dbRef = e.target.result;
	var objectStore = dbRef.createObjectStore(
	    'store', 
	    {keyPath: 'key'});
    };
};

var addToDatabase = function(entryObject) {
    var objectStore = entryDatabase.transaction("store", "readwrite").objectStore("store");
    var request = objectStore.add(entryObject);
    request.onsuccess = function(e) {
	console.log('successful add');
    };
    request.onerror = function(e) {
	console.log('fail to add');
    };
};
var readDatabase = function() {
    console.log('readDatabase DOM refresh.');
    //Reset 'list'. 
    document.getElementById('list').innerHTML = "";
    //Reset the table.
    document.getElementById('entryTable').innerHTML = 
	"<tr><th>id</th> <th>total time (ms)</th> <th>domain</th></tr>";

    var trans = entryDatabase.transaction('store');
    var objectStore = trans.objectStore('store');
    objectStore.openCursor().onsuccess = function(event) {
	var cursor = event.target.result;
	if(cursor) {
	    //Note: IndexedDB didn't store toString().
	    //Note: Ports don't seem to play well w/ toString() either.
	    var entryText = cursor.value.key+' ('+cursor.value.totalTime+'ms) - '+cursor.value.domain;
	    console.log(entryText);
	    //Append to 'list'.
	    //addBulletToDOM(cursor.value);
	    addEntryToTable(cursor.value);
	    cursor.continue();
	} else {
	    console.log('End of database read.');
	}
    };
};

//Listener: connects with background.js
//message contains an entryObject.
//addBulletToDOM is defined in timelog.js
chrome.runtime.onConnect.addListener(function(port) {
    if(port.name === 'entryPort') {
	port.onMessage.addListener(function(message) {
	    addToDatabase(message);
	    addEntryToTable(message);
	});
    }
});

document.getElementById('init').addEventListener('click', function() {initDatabase('entryDatabase',1); });
document.getElementById('read').addEventListener('click',readDatabase);
document.getElementById('wipe').addEventListener('click',wipe);

document.addEventListener('DOMContentLoaded', function() {
    initDatabase('entryDatabase',1);
    console.log('initDatabase from domcontentloaded.');
    //Need to find a way to read the database at startup.
});
