module.exports = function(io, app, message) {
  app.post("/deletemsg", function(req, res) {
    let id = req.body.message.id;
    io.emit("deletemsg", id);
    console.log("Message deleted");
    io.emit("deletemsg", id);
    console.log("Message deleted");
    message.findOne({ id: id }).exec(function(err, msg) {
      msg.remove();
    });
  });
};
