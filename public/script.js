const videoGrid = document.getElementById('video-grid');   //Get the div where video will be displayed 
const ownVideo = document.createElement('video');          //Creates a video element for the video of caller 
ownVideo.muted = true;

let ownVideoStr                                            //Video Stream of the Caller
navigator.mediaDevices.getUserMedia({                      //Get access to audio & video 
    video: true,
    audio: true
}).then(stream => {
    ownVideoStr = stream;
    addVideoStr(ownVideo, stream);
})

const addVideoStr = (video, stream) => {                   //Function to add video stream after loading all the media
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    videoGrid.append(video);                               //Append the video to be displayed
}