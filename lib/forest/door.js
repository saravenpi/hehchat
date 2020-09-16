module.exports = function(app, axios, use, uuidv4) {

  var CLIENT_ID = process.env.CLIENT_ID;
  var CLIENT_SECRET = process.env.CLIENT_SECRET;


  app.get("/door", (req, res) => {
    if (req.session.username) {
      res.redirect("door");
    }
    res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}`
    );
  });

  app.get("/oauth_callback", async (req, respp) => {
    if (!req.query.code) throw new Error("NoCodeProvided");

      // The req.query object has the query params that were sent to this route.
      const requestToken = req.query.code

      axios({
        method: 'post',
        url: `https://github.com/login/oauth/access_token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${requestToken}`,
        // Set the content type header, so that we get the response in JSON
        headers: {
             accept: 'application/json'
        }

      }).then((response) => {

        const accessToken = response.data.access_token
        console.log(response.data)


        // Call the user info API using the fetch browser library
        axios('https://api.github.com/user', {
            headers: {
              // Include the token in the Authorization header
              Authorization: 'token ' + accessToken
            }
          })
          // Parse the response as JSON
          .then(res => res.json())
          .then(res => {
            // Once we get the response (which has many fields)
            // Documented here: https://developer.github.com/v3/users/#get-the-authenticated-user
            // Write "Welcome <user name>" to the documents body
            var yayid = res.id
            var yayusername = res.login
            var yayavatar = res.avatar_url


            user.find({ id:  yayid}).exec(function(err, doc) {
              if (doc[0]) {
                req.session.username = doc[0].login;
                req.session.avatar = doc[0].avatar;
                req.session.id = doc[0].id;
                req.session.uuid = doc[0].uuid
                respp.redirect("/");
              } else {
                var newuuid = uuidv4();
                const doggy = new user({
                  login: yaylogin,
                  id: yayid,
                  avatar: yayavatar,
                  uuid: newuuid
                });
                doggy.save()
                req.session.username = res.login
                req.session.avatar = res.avatar_url
                req.session.id = res.id
                req.session.uuid = newuuid
              respp.redirect("/");
              }
            });
          })

      })









  });


};
