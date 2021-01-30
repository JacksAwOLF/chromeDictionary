/*

this script runs every time the url starts with
https://www.google.com/search
as defined in the manifest

*/

if (dictionaryExists()){

	chrome.storage.sync.get(['storedWords', 'activeWords'], function(data){

		var word = getWord();
		var addListName = 'old';
		if (data.storedWords[word] == undefined){
			addListName = 'new';
		}

		var sW = data.storedWords, aW = data.activeWords;
		if (sW == undefined) sW = {};
		if (aW == undefined) aW = {'new':[],'old':[]};
		sW[word] = getDateString();
		if (aW[addListName].includes(word) == false){
			aW[addListName].push(word);
		}

		chrome.storage.sync.set({
			'activeWords': aW,
			'storedWords': sW
		});

	});

} 


/* HOW DATA IS STORED

{
	activeWords: {
		"new": ["word1", "word2"],
		"old": ["word3"]
	},

	storedWords: {
		"word1": "last-accessed-date",
		"word2": "last-accessed-date",
		"word3": "last-accessed-date"
	}
}

activeWords are the words that they user is learning this week/period
storedWords are all the words learned in history

new and review is distinguished whether or not there is an entry in the
list before
*/



function dictionaryExists(){
	var dClassName = "hide-focus-ring zbA8Me gJBeNe NjNcGc vSuuAd mfMhoc";
	return document.getElementsByClassName(dClassName).length == 1 && 
		document.getElementsByClassName(dClassName)[0].innerHTML === "Dictionary";
}

function getWord(){
	var wClassName = "XcVN5d"; // DgZBFd
	return document.getElementsByClassName(wClassName)[0].children[0].innerText;
}

function getDateString(){
	return new Date().toString().split(" ").slice(1, 4).join(" ");
}
