require('dotenv').config()
var port = process.env.PORT || 3000;
var { v4: uuidv4 } = require('uuid');
var express = require("express");
var app = express();
var http = require("http").Server(app);
var session = require("express-session");
var io = require("socket.io")(http);
var mongoose = require("mongoose");
var axios = require('axios');
var fetch = require("node-fetch");
mongoose.connect(process.env.MONGODB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

var messageSchema = new mongoose.Schema({
  author: String,
  id: String,
  avatar: String,
  content: String,
  date: { type: Date, default: Date.now }
});

var message = mongoose.model("Message", messageSchema);

var userSchema = new mongoose.Schema({
  username: String,
  id: String,
  avatar: String,
  uuid: String

});

var user = mongoose.model("user", userSchema);



require("./motor")(app, express, session);

require("./forest/index")(app);

require("./forest/door")(app, axios, user, uuidv4, fetch);

require("./forest/logout")(app);

require("./forest/chat")(io, message, user);

require("./forest/app")(app);

require("./forest/deletemsg")(io, app,message);

http.listen(port, function() {
  console.log("Le serveur est ouvert sur le port :", port);
});
