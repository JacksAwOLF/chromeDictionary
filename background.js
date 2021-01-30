
/*
the code here only runs in the background.
I only need this to initialize the options
if they were cleared to shit
*/

chrome.runtime.onInstalled.addListener(function() {

	chrome.storage.sync.get(['activeWords', 'storedWords'], function(data){

		var aW = data.activeWords, sW = data.storedWords;

		if (aW == undefined){
			alert("populating aw");
			aW = {'new':[],'old':[]};
		}

		if (sW == undefined){
			alert("populating sw");
			sW = {};
		}

		chrome.storage.sync.set({
			'activeWords': aW,
			'storedWords': sW
		});

	});
	
});


