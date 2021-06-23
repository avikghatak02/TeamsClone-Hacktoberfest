const socket = io('/')

const videoGrid = document.getElementById('video-grid');   //Get the div where video will be displayed 
const ownVideo = document.createElement('video');          //Creates a video element for the video of caller 

ownVideo.muted = true;

const peer = new Peer(undefined, {                         //Create a new peer connection
    path: '/peerjs',
    host: '/',
    port: '3000'
});

let ownVideoStr                                            //Video Stream of the Caller
navigator.mediaDevices.getUserMedia({                      //Get access to audio & video 
    video: true,
    audio: true
}).then(stream => {
    ownVideoStr = stream;
    addVideoStr(ownVideo, stream);

    peer.on('call', call => {                              //Answering the call from the sender
        console.log('hi');
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideo => {
            addVideoStr(video, userVideo);
        });
    }, err => { console.log(err); })

    socket.on('user-connected', (userId) => {              //Connect new user when user-connected is broadcasted by sender
        setTimeout(() => {
            //user joined
            connectUser(userId, stream);
        }, 1000)
    })
});

peer.on('open', id => {                                //Listen on peer connection (id: id os new user)
    socket.emit('join-room', RoomId, id);
})

//VIDEO FUNCTIONS =================================================================================================================

const connectUser = (userId, stream) => {                  //Function to connect new user 
    const call = peer.call(userId, stream)                 //Calling the other user(client)
    const video = document.createElement('video')          //Create a new video element to be shown for another user
    call.on('stream', userVideo => {
        addVideoStr(video, userVideo)
    })
    call.on('close', () => {
        video.remove();
    })
}

const addVideoStr = (video, stream) => {                   //Function to add video stream after loading all the media
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    videoGrid.append(video);                               //Append the video to be displayed
}
