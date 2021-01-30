
1. if on google dictionary, page action shows the google dictionary text. otherwise shows nothing
2. store the date and text when a word is searched
3. display the list of words and their last accesse date when popup is clicked (a long scrolling list)
4. separate the list into new words and review words
5. 





FUTURE UPGRADES
=> only add a word if it is above a certain percentage on google books ngram viewer
=> automatically opens the *more definitions button, clears and selects search bar for you
=> keyboard shortcut to search a highlighted term on a website 


THIS IS THE MENU THAT SHOWS UP WHEN YOU RIGHT CLICK ON A WEBPAGE
chrome.contextMenus.create({});

background script runs in a separarate webpage. use it to define listeners. this is where it detects button presses and stuff
content scripts run on the website, like injection.
you can send messages between these two pages with chrome.message
