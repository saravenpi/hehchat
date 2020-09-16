module.exports = function(app) {

  app.get("/app", function(req, res) {

    console.log(req.session.uuid);
    console.log(req.session.username);


      if (!req.session.username) return res.redirect("/")

        res.render("app", {
            user: {
                username: req.session.username,
                avatar: req.session.avatar,
                id: req.session.id,
                uuid: req.session.uuid
              }
});




});
}
