String.prototype.allReplace = function(obj) {
  var retStr = this;
  for (var x in obj) {
    retStr = retStr.replace(new RegExp(x, "g"), obj[x]);
  }
  return retStr;
};


$(function() {




  function beep() {
    var snd = new Audio(
      "https://cdn.glitch.com/53cdc14c-b2e2-4d5a-ad4b-4e82060af191%2Fpop.mp3?v=1585762599307"
    );
    snd.play();
  }

  var socket = io();

  $("input").keydown(function(e) {
    socket.emit("is typing");
    if (e.keyCode == 13) {
      e.preventDefault();
      $("#inputzone").submit();
    }
  });



  $("#inputzone").submit(function() {
    if (
      $("#m")
        .val()
        .replace(/ /g, "").length < 1
    )
  return false;
    socket.emit("message", $("#m").val(), localStorage.getItem("token"));
    $('#m').val('');
    $("#m").reset();
    $("#inputzone").reset();
  return false;

  $('#m').val('');
  $("#m").reset();
  $("#inputzone").reset();

  });

  var messagespart = $("#messages");
  function messageemit(author, avatar, msg, id) {
    var realauthor = document.getElementById("usernamevalue").value

    if (author == realauthor) {
      messagespart.append(
        '<div id="' +
          id +
          '"><span> <img class="msgimg" src="' +
          avatar +
          '"  style="border-radius:50%; vertical-align: middle; display: inline;"></span>' +
          "      <div style='vertical-align: middle; display: inline;' class='username'>" +
          author +
          ":</div>" +
          '<span><form style="vertical-align: middle; display: inline;" action="/deletemsg" method="POST">' +
          '<input style="display: none; opacity:0;" type="text"  name="message[id]"  value="' +
          id +
          '">' +
          '<button class="dltbtn" type="submit" id="buttton"><i class="fas fa-trash-alt"></i></button></form></span>' +
          "<div class='content'>" +
          msg +
          "</div></div>"
      );
    } else {
      messagespart.append(
        '<span> <img class="msgimg" src="' +
          avatar +
          '"  style="border-radius:50%; vertical-align: middle; display: inline;"></span>' +
          "      <div style='vertical-align: middle; display: inline;' class='username'>" +
          author +
          ":</div>" +
          "<div class='content'>" +
          msg +
          "</div></div>"
      );
    }

    window.scrollTo({
      left: 0,
      top: document.getElementById("messages").scrollHeight,
      behavior: "smooth"
    });
  }


  socket.emit("add user", localStorage.getItem("token"));
  //console.log("add user : " + localStorage.getItem("token"));

  socket.on("user joined", function(username) {
    $("#memberlist").append(
      "<span class='dot'></span><h2 style='vertical-align: middle; display: inline;' id=" + username + ">" + username.username + "</h2>"
    );
  });
  socket.on("deletemsg", function(id) {
     window.stop();
    $("#" + id).fadeOut(function() {
      $(this).remove();
    });

  });

  socket.on("user left", function(username) {
    $(`#${username}`).remove();
  });

  socket.on("loadhist", function(author, avatar, msg, id) {
    messageemit(author, avatar, msg, id);
  });

  socket.on("message", function(author, avatar, msg, id) {
    messageemit(author, avatar, msg, id);
    var realauthor = document.getElementById("usernamevalue").value
    if (author != realauthor) beep();

  });

  socket.on("connexion", function() {
    $("#messages").empty();
    console.log("connexion");
  });
});
