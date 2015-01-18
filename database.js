chrome.runtime.onConnect.addListener(function(port) {
    if(port.name === 'entryPort') {
	port.onMessage.addListener(function(message) {
	    //add to database here!
	    addBulletToDOM(message);
	});
    }
});
