module.exports = function(app, axios, user, uuidv4) {

  var CLIENT_ID = process.env.CLIENT_ID;
  var CLIENT_SECRET = process.env.CLIENT_SECRET;


  app.get("/door", (req, res) => {
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
          }).then(res => {

            console.log(res);
            var yayid = res.id;
            var yayusername = res.login;
            var yayavatar = res.avatar_url;


            user.findOne({ id:  yayid}).exec(function(err, doc) {

              if (doc) {

                req.session.username = res.login;
                req.session.avatar = doc.avatar;
                req.session.id = doc.id;
                req.session.uuid = doc.uuid;

                respp.redirect("/");

              } else {

                var newuuid = uuidv4();
                const doggy = new user({

                  username: yayusername,
                  id: yayid,
                  avatar: yayavatar,
                  uuid: newuuid

                });
                doggy.save();

                req.session.username = res.login;
                req.session.avatar = res.avatar_url;
                req.session.id = res.id;
                req.session.uuid = newuuid;

                respp.redirect("/");

              }


            });






          });

      });









  });


};
