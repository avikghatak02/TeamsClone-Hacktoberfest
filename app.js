const express = require('express');
const app = express();                              //Initialize the express application
const server = require('http').Server(app);
const { v4: uuidv4 } = require('uuid');             //Require UUID to generate unique room ids
app.set('view engine', 'ejs');                      //Setting the view engine as ejs

//ROUTES===============================================================================================================================
app.get('/', (req, res) => {                        //Landing Route : Redirects to a unique room
    res.redirect(`/${uuidv4()}`);
})

app.get('/:room', (req, res) => {                   //Unique Room Route : Passes the unique room id to ejs file
    res.render('index', { roomId: req.params.room });
});


//SERVER ==============================================================================================================================
server.listen(3000, () => {
    console.log('Serving on Port 3000')
})