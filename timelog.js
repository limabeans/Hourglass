//LISTENER: expects messages of the new timelogs from background.js
chrome.runtime.onMessage.addListener(function(message,sender,sendResponse) {
    var list = document.getElementById(message.div);
    var textNode = document.createTextNode(message.text);
    var bullet = document.createElement(message.elemType);
    bullet.appendChild(textNode);
    
    list.appendChild(bullet);
});
