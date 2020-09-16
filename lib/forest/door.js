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

    var tokendata =  axios({
        method: 'post',
        url: `https://github.com/login/oauth/access_token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${requestToken}`,
        // Set the content type header, so that we get the response in JSON
        headers: {
             accept: 'application/json'
        }

      });
      var accessToken = tokendata.access_token
      console.log(tokendata)



        // Call the user info API using the fetch browser library
      var resuser =   axios('https://api.github.com/user', {
            headers: {
              // Include the token in the Authorization header
              Authorization: 'token ' + accessToken
            }
          });

            console.log(resuser);




            user.findOne({ id: resuser.id}).exec(function(err, doc) {

              if (doc) {

                req.session.username = resuser.login;
                req.session.avatar = doc.avatar;
                req.session.id = doc.id;
                req.session.uuid = doc.uuid;

                respp.redirect("/");

              } else {

                var newuuid = uuidv4();
                const doggy = new user({

                  username: resuser.login,
                  id:  resuser.id,
                  avatar: resuser.avatar_url,
                  uuid: newuuid

                });
                doggy.save();

                req.session.username = resuser.login;
                req.session.avatar = resuser.avatar_url;
                req.session.id = resuser.id;
                req.session.uuid = newuuid;

                respp.redirect("/");

              }


            });
















  });


};
