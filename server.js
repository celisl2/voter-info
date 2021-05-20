const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const path = require('path');
const cors = require('cors');


require('dotenv').config();
const app = express();
app.use(cors());
app.use(helmet());
let data = require('./conf/suppress.json');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

//connect to mongo db
mongoose.connect(
    process.env.DATABASE_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);

//start up db
const db = mongoose.connection;
db.on('error', (error) => {
    console.error(`[ERROR]: connection to database failed: ${error}`);
});
db.once('open', () => {
    console.log('[INFO]: connected to database');
    if(process.env.hasBeenAdded == 'false') {
        console.log('[INFO]: data not yet loaded. Will attempt to import data from json file.');
        
            db.collection("US_STATES").insertMany(data, (err, r) => {
                if(err) console.error(err);
                if(r) console.log(r.insertedCount);
            });
    } else {
        console.log('[INFO]: data already imported to cloud DB. Prepared to use API');
    } 
})

app.use(express.json());

const billsRouter = require('./routes/bills');
app.use('/bills', billsRouter);

//listen on server
app.listen(3030, () => {
    console.log('[INFO]: server startup');
});

app.get('/', (req, res) => {
    res.render('index');
});

