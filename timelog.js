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

//Listener: Mainly responsible for listening for setting changes
//from options.js
chrome.runtime.onMessage.addListener(function(message,sender,sendResponse) {
    if(message.titleColor) {
	var titleId = document.getElementById("title");
	titleId.style.color = message.titleColor;
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

var addBulletToDOM = function(entryObject) {
    var list = document.getElementById(entryObject.div);
    var textNode = document.createTextNode(entryObject.text);
    var bullet = document.createElement(entryObject.elemType);
    bullet.appendChild(textNode);
    list.appendChild(bullet);

};


