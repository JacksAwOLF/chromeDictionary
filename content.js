/*

this script runs every time the url starts with
https://www.google.com/search
as defined in the manifest

*/

// these variabless have to be on the top to work 
// for sosme reaso

// the 'Dictionary' title
var dClassName = "hide-focus-ring zbA8Me gJBeNe NjNcGc vSuuAd mfMhoc";
var dObj = document.getElementsByClassName(dClassName);

// the word looked up
var wClassName = "XcVN5d"; // DgZBFd
var wObj = document.getElementsByClassName(wClassName);


if (dictionaryExists()){

	chrome.storage.sync.get(null, function(data){

		var word = getWord(), 
			now = new Date().valueOf(),
			activeDate = now,
			sW = data.stored, 
			aW = data.active,  
			lC = data.since;


		// the last accessed date of the word to be added
		// should be stored if it is already seen
		if (sW[word] != undefined)
			activeDate = sW[word];

		// update the list of words that we seen already
		sW[word] = now;

		// only add the word on the active list
		// if this word isn't already inside the list
		var add = true;
		for (var key in aW)
			if (aW[key] == word)
				add = false;
		if (add)
			aW[activeDate] = word;


		chrome.storage.sync.set({
			'since': lC,
			'active': aW,
			'stored': sW
		});

	});

}




function dictionaryExists(){
	return dObj.length == 1 &&
		dObj[0].innerHTML === "Dictionary" && 
		wObj.length > 0 &&
		wObj[0].children.length > 0; 
}

function getWord(){
	return wObj[0].children[0].innerText.replace(/·/g, '');
}



