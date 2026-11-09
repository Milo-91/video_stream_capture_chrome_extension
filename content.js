console.log('meet video test');
console.log("=================================");
console.log("Meet Video Test Extension Loaded");
console.log("URL:", location.href);
console.log("=================================");

let recorder = null;
let chunks = [];
let pc = null;
let stream = null;
let isStarting = false;

async function startRecording(){
	const video = document.querySelector('video'); // capture html tag <video>
	
	// Avoid repeated start
	if(pc !== null || isStarting){
		console.log("Already started");
		return;
	}
	// ensure we capture the video track
	if(!video){
		console.error("No video found QQ");
	}else{
		// check video resize event
		video.addEventListener("resize", () => {
			console.log("Video resolution changed")
			console.log("Resolution:", video.videoWidth, video.videoHeight)
		});
		console.log("Video found", video);
		console.log("Resolution:", video.videoWidth, video.videoHeight);
		// video capture
		stream = video.captureStream();

		console.log("Stream:", stream);
		console.log("Video tracks:", stream.getVideoTracks());	

		// WebRTC connection
		pc = new RTCPeerConnection();
		for(const track of stream.getTracks()){
			const sender = pc.addTrack(track, stream);
			if(track.kind === 'video'){
				const params = sender.getParameters();
				params.degradationPreference = "maintain-resolution";
				await sender.setParameters(params);
			}
		}


		const offer = await pc.createOffer();
		await pc.setLocalDescription(offer);

		// ---signaling---
		const answer = await chrome.runtime.sendMessage({
			type: 'offer',
			sdp: pc.localDescription.sdp
		});
		// ---establish WebRTC connection---
		await pc.setRemoteDescription(answer);
		console.log('WebRTC connection established')
	
		isStarting = true;
		console.log('streaming started')
	}
}

function stopRecording(){
	// delete stream
	if(stream){
		// stream.getTracks().forEach(track => track.stop());
		stream = null;
	}
	// delete pc
	if(pc){
		pc.close()
		pc = null;
	}
	console.log('Streaming stopped')
	isStarting = false;
}

chrome.runtime.onMessage.addListener((message) => {
	if(message.command === 'start'){
		startRecording();
	}else if(message.command === 'stop'){
		stopRecording();
	}
});
