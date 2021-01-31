/*

this script runs everytime the popup button
of the extension on the top right corner
of the browser, to the right of the url
is clicked.

*/



chrome.storage.sync.get(['active', 'since'], loadWords);

function loadWords(data){

	clearTableEntries();

	var list = Object.keys(data.active).sort(),
		tableId = 'new';

	// loop from most recent words to most distant
	for (var i=list.length-1; i>=0; i--){

		// if one of the items on the sorted list
		// is before the last time we cleared,
		// then we know it is a review term
		if (list[i] < data.since)
			tableId = 'old';

		// make the word
		var text = document.createElement("h4"),
			textTD = document.createElement("td");
		text.innerText = data.active[list[i]];
		textTD.appendChild(text);

		// make the date
		var date = document.createElement("p"),
			dateTD = document.createElement("td");
		date.innerText = dateDiffStr(
			list[i], new Date().valueOf()) + " Ago";
		dateTD.appendChild(date);

		// make the X button
		var xButton = document.createElement('button'),
			xButtonTD = document.createElement("td");
		xButton.onclick = removeWord;
		xButtonTD.appendChild(xButton);

		// make the row
		var wordObj = document.createElement("tr");
		wordObj.appendChild(textTD);
		wordObj.appendChild(dateTD);
		wordObj.appendChild(xButtonTD);
		wordObj.setAttribute('data-index', [tableId, i.toString()].join(' '));
		document.getElementById(tableId).appendChild(wordObj);
	}


}




// this is rather inefficient
// but it should't happen very often
// and when i say inefficient its like max 80 words
function removeWord(arg){
	var word = arg.target.parentElement.parentElement.children[0].innerText;
	chrome.storage.sync.get(['active', 'since'], function(data){
		var aW = data.active;
		for (var key in aW)
			if (aW[key] == word)
				delete aW[key];
		data = {'since': data.since, 'active': aW};
		chrome.storage.sync.set({'active': aW}, function(){
			loadWords(data);	
		});
	});	
}




// a and b are milliseconds
// a < b
// return differnce between them
// in string fromat
function dateDiffStr(a, b){
	var div = [60, 60, 24, 7, 52, 9999];
	var nam = ['Second', 'Minute', 'Hour', 'Day', 'Week', 'Year'];
	a = parseInt(a/1000);
	b = parseInt(b/1000);
	for (var i in div){
		var na = parseInt(a/div[i]), 
			nb = parseInt(b/div[i]);
		if (na == nb){
			if (b-a != 1) nam[i] += 's';
			return (b-a).toString() + " " + nam[i];
		}
		a = na; b = nb;
	}

	return 'Too long ago...';
}




document.getElementById("copyAll").onclick = function(){
	chrome.storage.sync.get(['active'], function(data){
		var text = Object.values(data.active).join(' ');
		if (navigator.clipboard)
			navigator.clipboard.writeText(text);
		else alert("clipboard feature not available");
	});
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
		'active':{} ,
		'since': new Date().valueOf()
	});
}

function storedWordsReset(){
	chrome.storage.sync.set({ 'stored':{}} );
}

function clearTableEntries(){
	document.getElementById('new').innerHTML = '';
	document.getElementById('old').innerHTML = '';
}
