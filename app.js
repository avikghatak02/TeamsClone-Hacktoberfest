// const { Socket } = require('dgram');
const express = require('express');
const app = express();                                            //Initialize the express application
const server = require('http').Server(app);
const { v4: uuidv4 } = require('uuid');                           //Require UUID to generate unique room ids
const io = require('socket.io')(server)                           //Require Socket.io 
const { ExpressPeerServer } = require('peer');                    //Peer Server
const peerServer = ExpressPeerServer(server, {
    debug: true
});
app.set('view engine', 'ejs');                                    //Setting the view engine as ejs
app.use(express.static('public'));
app.use('/peerjs', peerServer);                                    //Specify url for peer js

//ROUTES===============================================================================================================================
app.get('/', (req, res) => {                                      //Landing Route : Redirects to a unique room
    res.redirect(`/${uuidv4()}`);
})

app.get('/:room', (req, res) => {                                 //Unique Room Route : Passes the unique room id to ejs file
    res.render('index', { roomId: req.params.room });
});

io.on('connection', Socket => {                                   //Join Room with Room ID
    Socket.on('join-room', (roomId, userId) => {
        Socket.join(roomId);
        Socket.broadcast.to(roomId).emit('user-connected', userId);  //Broadcast User is Connected to all clients except sender
    })
})
//SERVER ==============================================================================================================================
server.listen(3000, () => {
    console.log('Serving on Port 3000')
})
