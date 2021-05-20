"use strict";

var express = require('express');

var mongoose = require('mongoose');

var helmet = require('helmet');

var path = require('path');

var cors = require('cors');

require('dotenv').config();

var app = express();
app.use(cors());
app.use(helmet());

var data = require('./conf/suppress.json');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express["static"](path.join(__dirname, 'public'))); //connect to mongo db

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}); //start up db

var db = mongoose.connection;
db.on('error', function (error) {
  console.error("[ERROR]: connection to database failed: ".concat(error));
});
db.once('open', function () {
  console.log('[INFO]: connected to database');

  if (process.env.hasBeenAdded == 'false') {
    console.log('[INFO]: data not yet loaded. Will attempt to import data from json file.');
    db.collection("US_STATES").insertMany(data, function (err, r) {
      if (err) console.error(err);
      if (r) console.log(r.insertedCount);
    });
  } else {
    console.log('[INFO]: data already imported to cloud DB. Prepared to use API');
  }
});
app.use(express.json());

var billsRouter = require('./routes/bills');

app.use('/bills', billsRouter); //listen on server

app.listen(3030, function () {
  console.log('[INFO]: server startup');
});
app.get('/', function (req, res) {
  res.render('index');
});