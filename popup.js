
document.getElementById("start").addEventListener("click", async () => {
	// alert('start clicked');
	const [tab] = await chrome.tabs.query({
		active: true,
		currentWindow: true
	});

	chrome.tabs.sendMessage(tab.id, {command: 'start'});
});

document.getElementById("stop").addEventListener("click", async () => {
	// alert('stop clicked');
	const [tab] = await chrome.tabs.query({
		active: true,
		currentWindow: true
	});

	chrome.tabs.sendMessage(tab.id, {command: 'stop'});
});
