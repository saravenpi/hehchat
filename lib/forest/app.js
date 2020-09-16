module.exports = function(app) {

  app.get("/", function(req, res) {


      if (!req.session.username) return res.redirect("/")

res.render("index", {
  user: {
    username: req.session.username,
    avatar: req.session.avatar,
    id: req.session.id,
    uuid: req.session.uuid
  }
});




});
}
