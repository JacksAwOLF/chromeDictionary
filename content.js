/*

this script runs every time the url starts with
https://www.google.com/search
as defined in the manifest

*/

// these variabless have to be on the top to work 
// for sosme reaso


// the 'Dictionary' title
//var dClassName = "zbA8Me gJBeNe NjNcGc vSuuAd mfMhoc";
// zbA8Me gJBeNe NjNcGc mfMhoc
var dClassName = "vbr5i gJBeNe";
var dObj = document.getElementsByClassName(dClassName);

// the word looked up
var wClassName = "DgZBFd c8d6zd ya2TWb";// "XcVN5d"; // DgZBFd
var wObj = document.getElementsByClassName(wClassName);

// the definition of the word
var fClassName = "L1jWkf h3TRxf";
var fObj = document.getElementsByClassName(fClassName);



function dictionaryExists(){
	return dObj.length == 1 &&
		dObj[0].innerHTML === "Dictionary" && 
		wObj.length > 0 &&
		wObj[0].children.length > 0; 
}


function getWord(){
	return wObj[0].children[0].innerText.replace(/·/g, '');
}


if (dictionaryExists()){



	// play the audio pronunciation
	document.getElementsByClassName("brWULd")[0].children[0].play()


	// show the usage history of this word
	var hObj = document.getElementsByClassName("xpdxpnd gi0Tyb");
	hObj[hObj.length-1].setAttribute("style", "max-height: 185px");



	// get things from the storage
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

		console.log("adding "+word+" addd: "+add);

		console.log(aW);

		chrome.storage.sync.set({
			'since': lC,
			'active': aW,
			'stored': sW
		}, function(){console.log("set complete!");});

	});

}



