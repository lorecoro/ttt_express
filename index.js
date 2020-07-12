const express = require("express");
const cors = require('cors');
const path = require('path');
const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const router = require('./routes/api');
const bodyParser = require('body-parser');
const uri = "mongodb+srv://mongodb_user:mongodb_password@cluster0.8gcqw.mongodb.net/mongodb_database?retryWrites=true&w=majority";

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'DB connection error'));
    
const app = express();
app.set("views", "./views");
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({ origin: 'http://localhost:8080' }));
app.use(bodyParser.json());

app.get("/", (req,res) => {
  res.render('board', { 
    title: 'Tic tac toe',
  });
});

app.use('/api', router);

app.listen(8080);
