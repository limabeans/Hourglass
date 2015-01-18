//indexedDB.deleteDatabase('dbase') to restart.
//Global variable for database. 
//Probably have to refactor this sometime.
var entryDatabase;

var createDatabase = function(name, version) {
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
	    {keyPath: 'timeRange'});
    };
};

var addToDatabase = function() {
    var objectStore = entryDatabase.transaction("store", "readwrite").objectStore("store");
    var request = objectStore.add({
	timeRange: 1234,
	totalTime: 0,
	domain: 'top domain here', 
	url: 'sum url', 
	title: 'sum title' 
    });

    request.onsuccess = function(e) {
	console.log('successful add');
    };
    request.onerror = function(e) {
	console.log('fail to add');
    };
};

createDatabase('entryDatabase',1);

var readDatabase = function() {
    var trans = entryDatabase.transaction('store');
    var objectStore = trans.objectStore('store');
    objectStore.openCursor().onsuccess = function(event) {
	var cursor = event.target.result;
	if(cursor) {
	    console.log(cursor.value.totalTime + 
			cursor.value.title);
	    cursor.continue();
	} else {
	    console.log('End of database read.');
	}
    };
};



//readDatabase(entryDatabase, 'store');



//Listener: connects with background.js
//message contains an Entry object.
//addBulletToDOM is defined in timelog.js
chrome.runtime.onConnect.addListener(function(port) {
    if(port.name === 'entryPort') {
	port.onMessage.addListener(function(message) {
	    var entryObject = message.entryObject;
	    //add to database here!
	    addBulletToDOM(message);
	});
    }
});

document.getElementById('add').addEventListener('click',addToDatabase);
document.getElementById('read').addEventListener('click',readDatabase);
