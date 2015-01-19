# Hourglass #
Chrome extension that analyzes your web browsing habits to make you more productive.

## random todos ##
* Think about when I change workspaces, currently does not detect if the window is in focus.
* Multiple browsers open?
* The cross day problem.
* The 'blackout' problem.
* DFAish 'graph' web history representation.
* Storing each day in an objectStore? How I'm representing data in the back-end is actually one of the more important goals.
* Integrate this with google drive!@
* Make sure you only account for active windows and active tabs for accounting for time.
* <strike>figure out how to do local storage (and possible sync with google accounts)</strike>
* <strike>settings page (i.e. local storage)</strike>
* Figured basics of local storage for options.html -- Now need to worry about how to use HTML5 database of some sort; can't rely on chrome.storage for large amounts of data. 
* Settings basics figured out. Now need to add many more settings. . .
* Needs to be graphical (should have pie charts of the data, or bar charts, in many different formats)
* Track the major url website page, as well as individual pages
* Track how long you are actively on the website, vs just have it open in a tab
* tagging websites as educational vs music vs games vs social media etc...

## bugs ##
* Essentially getting trolled by async. Need to figure out how to call readDatabase after the database gets modified.. <i>On the first iteration after 'wiping' the database, if you start at homepage, flip to a tab, and back, it won't log until till the next iteration. If that made any sense.</i>
* Adding new tabs sometimes into database? sometimes?

## to-fix ##
* First base integration with database.js. However, still not sure how to load the database at startup. Although for now, that is a minor issue.<strike>Created garbage database in database.js. Apparently, due to async-ness, I can't directly call my add/create/read on database methods, but only hook them up to buttons, and then call them that way. Also, turns out you can't have an object as a key. So probably will use started time as key in database.</strike>
* Ignore the settings page
* I suspect that this will fix itself once I am updating a database rather than writing html to timelog.html. <strike>Must create timelog.html immediatelly in the background, or else nothing will get logged.</strike>
* Create timelog.html immediately within background.js so that the user can set settings in options.html and have it reflected by the time they click the browser action. Although I think that I don't have to worry about this anymore because of getPreviousOptions() in timelog.js
