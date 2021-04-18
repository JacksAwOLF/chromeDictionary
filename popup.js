/*

this script runs everytime the popup button
of the extension on the top right corner
of the browser, to the right of the url
is clicked.

*/


chrome.storage.sync.get(['active', 'since'], loadWords);

function loadWords(data){

	console.log(data.active);

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

		var id = [tableId, i.toString()].join('_');

		// make the definition button
		var mButton = document.createElement('button'),
			mButtonTD = document.createElement("td");
		mButton.onclick = getDefinition;
		mButton.setAttribute('class', 'morebutton');
		mButton.setAttribute('id', id+' mbutt');
		mButtonTD.appendChild(mButton);

		// make the word
		var text = document.createElement("h4"),
			textTD = document.createElement("td");
		text.innerText = data.active[list[i]];
		text.setAttribute('id', id+' word');
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
		xButton.setAttribute('class', 'xbutton');
		xButton.setAttribute('id', id+' xbutt');
		xButtonTD.appendChild(xButton);

		// make the definition text
		var wordP = document.createElement('p');
		wordP.setAttribute('id', id+' wordp');
		wordP.setAttribute('class', 'wordp');

		// make the row
		var wordObj = document.createElement("div");
		wordObj.appendChild(mButton);
		wordObj.appendChild(text);
		wordObj.appendChild(date);
		wordObj.appendChild(xButton);
		wordObj.appendChild(document.createElement('br'));
		wordObj.appendChild(wordP);
		wordObj.setAttribute('data-index', id);

		var wordTR = document.createElement('tr');
		wordTR.appendChild(wordObj);
		document.getElementById(tableId).appendChild(wordTR);


	}


}


// todo: make this a php file 
// so we don't expose the credentials and stuff
function getDefinition(arg){

	var endpoint = "entries";
	var language_code = "en-us";
	var wordId = getWordIdFromId(arg.target.getAttribute('id'));
	var word = document.getElementById(wordId + " word").innerText;

	var wordP = document.getElementById(wordId + " wordp");

	if (wordP.innerText != ""){
		wordP.innerText = "";
		return;
	}
		
	var url = "https://od-api.oxforddictionaries.com/api/v2/";
	url += endpoint + "/" + language_code + "/" + word.toLowerCase();
	url += "?fields=definitions";
	var app_id = '0816eb35';
	var app_key = 'ae7760177c7934912644b8ce257ba83c';

	var http = new XMLHttpRequest();
	http.open("GET", url);
	http.setRequestHeader('app_id', app_id);
	http.setRequestHeader('app_key', app_key);
	http.send(null);

	var wordP = document.getElementById(wordId + " wordp");
	wordP.innerText = "";

	http.onload = function(){
		var data = JSON.parse(http.responseText);
		data['results'][0]['lexicalEntries'].forEach((item, index) => {
			var cate = item['lexicalCategory']['text'];
			var defi = item['entries'][0]['senses'][0]['definitions'][0];
			wordP.innerText += cate + ": " + defi + '\n';
		});
	}
}


// this is rather inefficient
// but it should't happen very often
// and when i say inefficient its like max 80 words
function removeWord(arg){
	var wordId = getWordIdFromId(arg.target.getAttribute('id'))
	var word = documet.getElementById(wordId + " word").innerText;

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

function getWordIdFromId(id){
	return id.split(" ")[0];
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





