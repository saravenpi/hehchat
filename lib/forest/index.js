module.exports = function(app) {


  app.get("/", function(req, res) {
  res.send("not logged<br><a href='/door'>login</a>'")
  });


};
