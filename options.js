console.log('coming from options.js');
//let's make the title change color


var saveOptions = function() {
    var color = document.getElementById('color').value;
    //Store the color in sync.
    chrome.storage.sync.set({
	titleColor: color
    }, function() {
	//Send a message to timelog.js to change color of its title.
	chrome.runtime.sendMessage({
	    titleColor: color
	});

	//Manage the status that the user sees.
	var status = document.getElementById('status');
	status.textContent = '[SAVED]. Color changed to: ' + color;
	setTimeout(function() {
	    status.textContent = 'le status';
	}, 750);
    });
};


document.getElementById('save').addEventListener('click', 
						 saveOptions);

//BETA--.

var port = chrome.runtime.connect({name: "beta"});

var portButton = function() {
    port.postMessage({msg: "port from options!"});
};

document.getElementById('portbutton').addEventListener('click',
						       portButton);
