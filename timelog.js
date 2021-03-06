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

var addEntryToTable = function(entryObject) {
    var table = document.getElementById('entryTable');
    var newRow = table.insertRow(table.rows.length);

    var id = document.createTextNode(entryObject.key);
    var time = document.createTextNode(entryObject.totalTime);
    var domain = document.createTextNode(entryObject.domain);

    var idCell = newRow.insertCell(0);
    idCell.appendChild(id);
    var timeCell = newRow.insertCell(1);
    timeCell.appendChild(time);
    var domainCell = newRow.insertCell(2);
    domainCell.appendChild(domain);
};
