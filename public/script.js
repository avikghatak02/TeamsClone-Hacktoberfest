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
    //CHAT BOX FUNCTIONALITIES USING SOCKET IO ==================================================================================

    let text = $('input')                                      //Getting the message from the chat box
    console.log(text)
    $('html').keydown((e) => {                                 //After pressing input send message from client to server
        if (e.which == 13 && text.val().length !== 0) {
            console.log(text.val())
            socket.emit('message', text.val());
            text.val('')
        }
    })

    socket.on('createMessage', message => {                    //Recieving the message from the server 
        $('ul').append(`<li class="message"><b>USER</b></br>${message}</li>`) //Adding message in the html file
        scrollToBottom()
    })
});

peer.on('open', id => {                                    //Listen on peer connection (id: id os new user)
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

const scrollToBottom = () => {                             //Function to scroll the chat window
    let x = $('.chat_window');
    x.scrollTop(x.prop("scrollHeight"));
}

//FUNCTIONING BUTTONS ==============================================================================================================

const muteUnmute = () => {                                 //Function to Mute if Unmuted and vice-versa
    const enabled = ownVideoStr.getAudioTracks()[0].enabled; //get the current status of audio (if muted/unmuted)
    if (enabled) {                                         //if audio is muted => unmute and change the icon 
        ownVideoStr.getAudioTracks()[0].enabled = false;
        setUnmuteBtn();
    } else {                                               //if audio is unmuted => mute and change the icon
        setMuteBtn();
        ownVideoStr.getAudioTracks()[0].enabled = true;
    }
}

const setUnmuteBtn = () => {                               //Function to set the Unmute button (change icon)
    const html = `<i class=" fas fa-microphone-slash"></i>`
    document.querySelector('.mute_btn').innerHTML = html;  //change the html code to change icon
}

const setMuteBtn = () => {                                 //Function to set the Mute button (change icon)
    const html = `<i class="fas fa-microphone"></i>`
    document.querySelector('.mute_btn').innerHTML = html;
}

const stopPlay = () => {                                   //Function to stop or play video when icon is clicked
    let enabled = ownVideoStr.getVideoTracks()[0].enabled; //get current status of video (if playing/stopped)
    if (enabled) {                                         //if video is on, turn it off and change icon 
        ownVideoStr.getVideoTracks()[0].enabled = false;
        setPlayVid();
    } else {                                               //else if video is off, turn it on and change icon 
        setStopVid();
        ownVideoStr.getVideoTracks()[0].enabled = true;
    }
}

const setStopVid = () => {                                 //Function to change video icon by changing innerhtml
    const html = `<i class=" fas fa-video"></i>`
    document.querySelector('.video_btn').innerHTML = html;
}

const setPlayVid = () => {                                 //Function to change video icon by changing innerhtml
    const html = `<i class=" fas fa-video-slash"></i>`
    document.querySelector('.video_btn').innerHTML = html;
}
