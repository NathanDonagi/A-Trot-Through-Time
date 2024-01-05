var express = require('express');
var app = express();
var server = require('http').Server(app);
const path = require('path');

server.listen(8080);


app.use(express.static('public'));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname,'public/index.html'));
});

console.log("hi")


app.use('/static', express.static('node_modules'));

var io = require('socket.io')(server,{});
io.sockets.on('connection', function(socket){
    console.log("Connected succesfully to the socket ...");

    socket.on('screen', function (data) {
        console.log(data);
    });
});

