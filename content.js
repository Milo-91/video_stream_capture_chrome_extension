console.log('meet video test');
console.log("=================================");
console.log("Meet Video Test Extension Loaded");
console.log("URL:", location.href);
console.log("=================================");

let recorder = null;
let chunks = [];

function startRecording() {
	const video = document.querySelector('video'); // capture html tag <video>
	
	// ensure we capture the video track
	if(!video){
		console.error("No video found QQ");
	}else{
		console.log("Video found", video);
		console.log("Resolution:", video.videoWidth, video.videoHeight);
	
		const stream = video.captureStream();
	
		console.log("Stream:", stream);
		console.log("Video tracks:", stream.getVideoTracks());
	
		// start recording
		console.log(MediaRecorder.isTypeSupported('video/webm;codecs=vp8'))
		recorder = new MediaRecorder(stream, {
			mimeType: "video/webm;codecs=vp8"
		});
	
		recorder.ondataavailable = (event) => {
			if(event.data.size > 0) {
				chunks.push(event.data);
			}
		};
	
		recorder.onstop = () => {
			console.log("recording stopped");
			const blob = new Blob(chunks, {
				type: "video/webm"
			});
	
			const url = URL.createObjectURL(blob);
	
			const a = document.createElement("a");
	
			a.href = url;
			a.download = "meet-recording.webm";
	
			document.body.appendChild(a);
			a.click();
			a.remove();
	
			URL.revokeObjectURL(url);
	
			console.log("video downloaded");
		};
	
		recorder.start();
	
		console.log('recording started')
	}
}

function stopRecording(){
	console.log('stop recording')
	if(!recorder){
		console.log('no recorder');
		return;
	}

	if(recorder.state !== "inactive"){
		recorder.stop();
		console.log('stop recorder');
	}
}

chrome.runtime.onMessage.addListener((message) => {
	if(message.command === 'start'){
		startRecording();
	}else if(message.command === 'stop'){
		stopRecording();
	}
});
