//Access the settings that may have already been previously configured in options.html
var getPreviousOptions = function() {
    //Use default color black, otherwise.
    chrome.storage.sync.get({
	titleColor: 'black'
    }, function(items) {
	var titleId = document.getElementById("title");
	titleId.style.color = items.titleColor;
    });
};

getPreviousOptions();

//Listener: Expects messages of the new timelogs from background.js
chrome.runtime.onMessage.addListener(function(message,sender,sendResponse) {
    //If: came from options.js
    //For changed the title color.
    if(message.titleColor) {
	var titleId = document.getElementById("title");
	titleId.style.color = message.titleColor;
    } else {
	//Else: came from background.js
	//For updating the bullets on timelog.html
	//Consider switching from messages to direct connections.
	var list = document.getElementById(message.div);
	var textNode = document.createTextNode(message.text);
	var bullet = document.createElement(message.elemType);
	bullet.appendChild(textNode);
	
	list.appendChild(bullet);
    }
});

//Function that adds functionality to clear button.
var clearButton = function() {
    var button = document.getElementById("clear");
    button.addEventListener('click', function() {
	document.getElementById("list").innerHTML = "";
    });
};


//Function that 'initializes' functionality of all buttons.
var initButtons = function() {
    clearButton();
};

initButtons();
