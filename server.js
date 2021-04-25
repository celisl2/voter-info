const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config();
const app = express();
//const hasBeenAdded = false;
let data = require('./conf/suppress.json');

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
    if(!process.env.hasBeenAdded) {
        console.log('[INFO]: data not yet loaded. Will attempt to import data from json file.');

        db.collection("states").insertOne(data, (err, r) => {
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
app.listen(3000, () => {
    console.log('[INFO]: server startup');
})
