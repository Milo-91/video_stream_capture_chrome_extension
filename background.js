console.log('---------background.js loaded-----------')
chrome.runtime.onMessage.addListener(
	(message, sender, sendResponse) => {
		if(message.type == 'offer'){
			console.log('-----handleOffer-----')
			handleOffer(message, sendResponse);
			return true;
		}else{
			return;
		}
	}
)

async function handleOffer(message, sendResponse){
	try{
		console.log(message.sdp)
		console.log(message.type)
		const response = await fetch('http://127.0.0.1:8080/offer',{
			method: 'POST',
			headers:{
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				sdp: message.sdp,
				type: message.type 
			})
		});
		
		if(!response.ok){
			throw new Error('HTTP error: ', response.status);
		}

		console.log('response:', response);
		const answer = await response.json();
		console.log('Answer:', answer);
		sendResponse(answer);
	}catch(error){
		console.error('Signaling error:', error);
		sendResponse({error: error.message});
	}
}
