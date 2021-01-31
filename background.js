
/*
the code here only runs in the background.
I only need this to initialize the options
if they were cleared to shit
*/

chrome.runtime.onInstalled.addListener(function() {

	chrome.storage.sync.get(null, function(data){

		var aW = data.active, 
			sW = data.stored, lC = data.since;

		if (sW == undefined) sW = {};
		if (aW == undefined) aW = {};
		if (lC == undefined) lC = new Date().valueOf();

		chrome.storage.sync.set({
			'since': lC,
			'active': aW,
			'stored': sW
		});

	});
	
});
