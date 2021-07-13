const express = require('express');
const app = express();                                            //Initialize the express application
const server = require('http').Server(app);
const { v4: uuidv4 } = require('uuid');                           //Require UUID to generate unique room ids
const io = require('socket.io')(server)                           //Require Socket.io 
const { ExpressPeerServer } = require('peer');                    //Peer Server
const bodyParser = require("body-parser");
const peerServer = ExpressPeerServer(server, {
    debug: true
});
app.set('view engine', 'ejs');                                    //Setting the view engine as ejs
app.use(express.static('public'));
app.use('/peerjs', peerServer);                                   //Specify url for peer js
app.use(bodyParser.urlencoded({ extended: true }));

//ROUTES===============================================================================================================================
app.get('/', (req, res) => {                                      //Home Page Route
    res.render('home');
})

app.post('/landing', (req, res) => {                              //Landing Route
    const username = req.body.username;
    res.render('landing', { username: username });
})

app.get('/meeting', (req, res) => {                               //New Meeting Route : Redirects to a unique room
    res.redirect(`/meeting/${uuidv4()}`);
})

app.post('/meeting', (req, res) => {                              //Get meeting ID from user to join an existing meeting
    var rID = req.body.MeetId;
    res.redirect(`/meeting/${rID}`);
})

app.get('/meeting/:room', (req, res) => {                         //Unique Room Route : Passes the unique room id to ejs file
    res.render('index', { roomId: req.params.room });
});

io.on('connection', Socket => {                                   //Join Room with Room ID
    Socket.on('join-room', (roomId, userId, username) => {
        Socket.join(roomId);
        //Broadcast User is Connected to all clients except sender
        Socket.broadcast.to(roomId).emit('user-connected', userId, username);

        Socket.on('message', message => {                          //Listens for the message recieved from the chat box
            io.to(roomId).emit('createMessage', message, username);//emits message to all clients in the same room from server 
        })
        //DISCONNECTING USER
        Socket.on('disconnect', () => {
            Socket.to(roomId).emit('user-disconnected', userId, username);
        })
    })
})

//SERVER ==============================================================================================================================
server.listen(process.env.PORT || '3000');
