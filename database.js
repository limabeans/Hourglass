//indexedDB.deleteDatabase('dbase') to restart.
//Global variable for database. 
//Probably have to refactor this sometime.
var entryDB;

//Function that deletes everything in entryDB.
var wipe = function() {
    indexedDB.deleteDatabase('entryDB');
    console.log('entryDB wiped');
    //Reload the page, ignore cache.
    location.reload(true);
};

//Function that initializes the database.
//Listening to DOMContentLoaded.
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

//Adds entryObjects to entryDB database.
//It runs once receiving a message from background.js.
var addToDatabase = function(entryObject) {
    var objectStore = entryDB.transaction('everyday', "readwrite").objectStore('everyday');
    var request = objectStore.add(entryObject);
    request.onsuccess = function(e) {
	console.log('successful add');
	readDatabase();
    };
    request.onerror = function(e) {
	console.log('fail to add');
    };
};

//readDatabase reads the contents in entryDB and also
//does DOM manipulation to generate what the user sees.
//This isn't very MVC, but I wasn't able to get the database
//to be backend. :(
var readDatabase = function() {

    var lifetime=0;
    var viewed=0;
    var domainFreqs = {}; //{domain: {timesAccessed, totalTime} }

    //Reset the tables.
    document.getElementById('entryTable').innerHTML = 
	"<tr><th>id</th> <th>total time (ms)</th> <th>domain</th></tr>";
    document.getElementById('statsTable').innerHTML = 
	"<tr> <th>domain</th><th>times accessed</th><th>time (ms)</th></tr>";

    //Iterating through everything in 'everyday'.
    var trans = entryDB.transaction('everyday');
    var objectStore = trans.objectStore('everyday');
    objectStore.openCursor().onsuccess = function(event) {
	var cursor = event.target.result;
	if(cursor) {
	    //Adding to table with all entries.
	    var entryText = cursor.value.key+' ('+cursor.value.totalTime+'ms) - '+cursor.value.domain;
	    addEntryToTable(cursor.value);

	    //Increment lifetime, increment viewed, and add to domainFreqs.
	    lifetime+=cursor.value.totalTime;
	    viewed+=1;
	    var domain = cursor.value.domain;
	    var cursorTotalTime = cursor.value.totalTime;

	    //Increment stuff or create new entry in domainFreqs.
	    if(domain in domainFreqs) {
		//Increment times accessed by 1.
		domainFreqs[domain].timesAccessed+=1;
		//Add the time for that instance.
		domainFreqs[domain].totalTime+=cursorTotalTime;
	    } else {
		//Create new entry for the new domain.
		domainFreqs[domain] = {timesAccessed:1,
				       totalTime:cursorTotalTime
				      };
	    }
	    cursor.continue();
	} else {
	    //We are done now!

	    //Generate pie animation.
	    createPie(domainFreqs);
	    //Total time count.
	    document.getElementById('lifetime').innerHTML=lifetime;
	    //Count of unique domains viewed.
	    var unique = Object.keys(domainFreqs).length;
	    document.getElementById('unique').innerHTML=unique;
	    //Count of all domains viewed.
	    document.getElementById('viewed').innerHTML=viewed;
	    processFreqsTable(domainFreqs);
	}
    };
};


//DOMs the frequencies table. Called from readDatabase.
var processFreqsTable = function(freqsTable) {
    var table = document.getElementById('statsTable');
    for(var i in freqsTable) {
	var row = table.insertRow(table.rows.length);
	
	var domain = document.createTextNode(i);
	var timeAccessed = document.createTextNode(freqsTable[i].timesAccessed);
	var totalTime = document.createTextNode(freqsTable[i].totalTime);
	
	var domainCell = row.insertCell(0);
	domainCell.appendChild(domain);
	var timeAccessedCell = row.insertCell(1);
	timeAccessedCell.appendChild(timeAccessed);
	var totalTimeCell = row.insertCell(2);
	totalTimeCell.appendChild(totalTime);
    }
};


//Listener: connects with background.js
//message contains an entryObject.
//addBulletToDOM is defined in timelog.js
chrome.runtime.onConnect.addListener(function(port) {
    if(port.name === 'entryPort') {
	port.onMessage.addListener(function(message) {
	    addToDatabase(message);
	});
    }
});

document.getElementById('read').addEventListener('click',readDatabase);
document.getElementById('wipe').addEventListener('click',wipe);

document.addEventListener('DOMContentLoaded', function() {
    initDatabase('entryDB',1);
    //Need to find a way to read the database at startup.
});
