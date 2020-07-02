const express = require("express");
const path = require('path');
const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const controller = require('./controllers/controller');

const uri = "mongodb+srv://mongodb_user:mongodb_password@cluster0.8gcqw.mongodb.net/mongodb_database?retryWrites=true&w=majority";

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'DB connection error'));
const dostuff = async () => {
  await controller.store()
  .then(async () => {
    await controller.retrieve();
  })
};

dostuff();

const app = express();
app.set("views", "./views");
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req,res) => {
  res.render('board', { 
    title: 'Tic tac toe',
  });
});

app.listen(8080);
