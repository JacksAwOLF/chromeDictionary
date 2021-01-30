/*

this script runs everytime the popup button
of the extension on the top right corner
of the browser, to the right of the url
is clicked.

*/

chrome.storage.sync.get(['activeWords', 'storedWords'], loadWords);

function loadWords(data){
	var newWords = data.activeWords['new'],
		oldWords = data.activeWords['old'],
		storedWords = data.storedWords;
	
	for (var i in newWords){
		document.getElementById('newWords').appendChild(
			makeWord(newWords[i], storedWords[newWords[i]])
		);
	}

	for (var i in oldWords){
		document.getElementById('oldWords').appendChild(
			makeWord(oldWords[i], storedWords[oldWords[i]])
		);
	}
}


function makeWord(word, date){
	var wordObj = document.createElement("tr");
	var wordText = document.createElement("td");
	var wordDate = document.createElement("td");
	wordText.innerText = word;
	wordDate.innerText = date;
	wordObj.appendChild(wordText);
	wordObj.appendChild(wordDate);
	return wordObj;
}

document.getElementById("clearActive").onclick = function (){
	activeWordsReset();
	clearTableEntries();
}

document.getElementById("clearAll").onclick = function (){
	activeWordsReset();
	storedWordsReset();
	clearTableEntries();
}

function activeWordsReset(){
	chrome.storage.sync.set({
		'activeWords':{'new':[],'old':[]}
	});
}

function storedWordsReset(){
	chrome.storage.sync.set({'storedWords':{}});
}

function clearTableEntries(){
	document.getElementById('newWords').innerHTML = '';
	document.getElementById('oldWords').innerHTML = '';
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
