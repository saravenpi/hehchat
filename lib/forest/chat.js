const xss = require("xss");
const markdown = require("markdown").markdown;

let users_online = new Set();




module.exports = function(io, message, user) {
  
  function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

  io.on("connection", function(socket) {
    var query = message
      .find()
      .sort({ date: -1 })
      .limit(75);

    query.exec(function(err, docs) {
      socket.emit("connexion");
      docs.reverse().map(message => {
        if (message.content.replace(/ /g, "").length < 1) return;
        socket.emit(
          "loadhist",
          xss(message.author),
          xss(message.pp),
          markdown.toHTML(xss(message.content)),
          message.id)
      });
    });

    // y a encore l'erreur

    socket.on("add user", function(token) {
      console.log("reçu");
      user.find({ token: token }).exec(function(err, doc) {
        users_online.add(token);
        let username = doc[0].username;
        socket.username = username;
        socket.token = token;
        console.log(socket.username);
        io.emit("user joined", {
          username: socket.username
        });
      });
    });

    socket.on("disconnect", function() {
      users_online.delete(socket.token)
      socket.broadcast.emit("user left", {
        username: socket.username
      });
    });

    socket.on("message", function(msg, token) {
      if (msg.replace(/ /g, "").length < 1) return;
      user.find({ token: token }).exec(function(err, doc) {
        let author = doc[0].username;
        let pp = doc[0].pp;
        let id = makeid(120)

        io.emit("message", xss(author), xss(pp), markdown.toHTML(xss(msg)), id);

        const kitty = new message({
          author: author,
          pp: pp,
          id: id,
          content: msg
        });

        kitty.save().then(console.log("meow"));
      });
    });
    
    
    
    
    
    
    
  });
};

/*

y a à nouveau l'erreur

*/