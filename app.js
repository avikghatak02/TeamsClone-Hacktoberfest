const express = require('express');
const app = express();                        //Initialize the express application
const server = require('http').Server(app);

app.set('view engine', 'ejs');                //Setting the view engine as ejs

//ROUTES===============================================================================================================================
app.get('/', (req, res) => {
    res.render('index');
})


//SERVER ==============================================================================================================================
server.listen(3000, () => {
    console.log('Serving on Port 3000')
})