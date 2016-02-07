var express = require('express');
var app     = express();
var server  = require('http').createServer(app);
var io      = require('socket.io').listen(server);
var ent     = require('ent');


app.use(express.static(__dirname + '/public'));

var clients = [];

io.sockets.on('connection', function (socket, data) {
	socket.on('newClient', function(data){
		data = ent.encode(data);
		clients.push(data);
		socket.name = data;
		socket.emit('connectionFeedback', clients);
		socket.broadcast.emit('newClient', data);
	});

	socket.on('disconnect', function() {
		var index = clients.indexOf(socket.name);
		clients.splice(index, 1);
		socket.broadcast.emit('clientDisconnected', socket.name);
	});

	socket.on('changeText', function(data) {
		socket.broadcast.emit('newText', data);
	})
});

server.listen(1337);