//Database that tracks the 'everyday' statistics.
var statsDB;
var initRequest = indexedDB.open('statsDB',1);
initRequest.onerror = function(e) {
    console.log('Error creating statsDB.');
};
initRequest.onsuccess = function(e) {
    statsDB = e.target.result;
    console.log('statsDB successfully initialized.');
};
initRequest.onupgradeneeded = function(e) {
    console.log('statsDB upgrade.');
    var dbRef = e.target.result;
    var objectStore = dbRef.createObjectStore(
	'stats', {keyPath: 'name'});
};




