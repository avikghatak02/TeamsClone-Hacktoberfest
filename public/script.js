//import { Socket } from 'dgram';
const socket = io('/')

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

socket.emit('join-room', RoomId);

socket.on('user-connected', () => {                        //Connect new user when user-connected is broadcasted by sender
    connectUser();
})

//VIDEO FUNCTIONS =================================================================================================================
const addVideoStr = (video, stream) => {                   //Function to add video stream after loading all the media
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    videoGrid.append(video);                               //Append the video to be displayed
}

const connectUser = () => {                                //Function to connect new user 
    console.log('new user');
}