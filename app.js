var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);

app.use("/public", express.static("public"));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/public/index.html");
});

io.on("connection", function(socket) {
    console.log("connection");

    socket.on("disconnect", function() {
        console.log("disconnect");
    });

    socket.on("add track", function(msg) {
        io.emit("add track", msg);
    });
});


http.listen(3000, function() {
    console.log("server started on :3000");
});
