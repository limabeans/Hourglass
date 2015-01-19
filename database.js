//indexedDB.deleteDatabase('dbase') to restart.
//Global variable for database. 
//Probably have to refactor this sometime.
var entryDB;
var wipe = function() {
    indexedDB.deleteDatabase('entryDB');
    console.log('entryDB wiped');
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
	entryDB = e.target.result;
	console.log(entryDB);
	console.log('Successfully initialized ' + 
		    name + ' v' + version);
    };
    request.onupgradeneeded = function(e) {
	console.log('Upgrade on ' + name + '. version: ' +
		    version);
	var dbRef = e.target.result;
	var objectStore = dbRef.createObjectStore(
	    'everyday', 
	    {keyPath: 'key'});
    };
};

var addToDatabase = function(entryObject) {
    var objectStore = entryDB.transaction('everyday', "readwrite").objectStore('everyday');
    var request = objectStore.add(entryObject);
    request.onsuccess = function(e) {
	console.log('successful add');
    };
    request.onerror = function(e) {
	console.log('fail to add');
    };

    //Lol. Get rid of this call eventually.
    readDatabase();
};
var readDatabase = function() {
    var lifetime=0;
    console.log('readDatabase DOM refresh.');
    //Reset the table.
    document.getElementById('entryTable').innerHTML = 
	"<tr><th>id</th> <th>total time (ms)</th> <th>domain</th></tr>";
    var trans = entryDB.transaction('everyday');
    var objectStore = trans.objectStore('everyday');
    objectStore.openCursor().onsuccess = function(event) {
	var cursor = event.target.result;
	if(cursor) {
	    //Note: IndexedDB didn't store toString().
	    //Note: Ports don't seem to play well w/ toString() either.
	    var entryText = cursor.value.key+' ('+cursor.value.totalTime+'ms) - '+cursor.value.domain;
	    console.log(entryText);

	    addEntryToTable(cursor.value);
	    //Increment lifetime.
	    lifetime+=cursor.value.totalTime;
	    cursor.continue();
	} else {
	    document.getElementById('lifetime').innerHTML=lifetime;
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
	    //Refresh database details.
	    //!! Inefficient, so will have to revamp into
	    //!! possibly another database in the future.
	    //I was possibly getting 'lagging' tables because
	    //of the async nature of addToDatabase and 
	    //addEntryToTable.
	    readDatabase();
	});
    }
});

document.getElementById('read').addEventListener('click',readDatabase);
document.getElementById('wipe').addEventListener('click',wipe);

document.addEventListener('DOMContentLoaded', function() {
    initDatabase('entryDB',1);
    console.log('initDatabase from domcontentloaded.');
    //Need to find a way to read the database at startup.
});
