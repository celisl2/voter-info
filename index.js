const express = require('express');
const app = express();
const axios = require('axios');
const path = require('path');
const dotenv = require('dotenv');

const SUPPRESSION_BILLS = "https://datawrapper.dwcdn.net/Fxxfw/5/";


dotenv.config();

app.set('views', path.join(__dirname, 'views')); //source of template
app.set('view engine', 'pug'); //tells node what engine to use
app.use(express.static(path.join(__dirname, 'public'))); //where to find static assets

//home page
app.get('/', (req, res) => {
    //res.send("Hello");
    res.render('index');
})

//get bills depending on that state
app.get('/getBills', (req, res) => {
    
})

const server = app.listen(3000, () => {
    console.log(`Application started on port ${server.address().port}`)
});