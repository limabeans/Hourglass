# Hourglass #
google chrome extension that tracks statistics of the websites you've been on

## random todos ##
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


## to-fix ##
* I suspect that this will fix itself once I am updating a database rather than writing html to timelog.html. <strike>Must create timelog.html immediatelly in the background, or else nothing will get logged.</strike>
* Create timelog.html immediately within background.js so that the user can set settings in options.html and have it reflected by the time they click the browser action. Although I think that I don't have to worry about this anymore because of getPreviousOptions() in timelog.js
