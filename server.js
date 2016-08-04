// var http = require('http');
// var server = http.createServer((req, res) => {
// 	res.writeHead(200, {
// 		'Content-Type': 'text/plain'
// 	});
// 	res.write('hello world');
// 	res.end();
// });

const express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server), //绑定到服务器
	users = ['a']; //保存用户列表

app.use('/', express.static('dist', {
	setHeaders(res) {
		"use strict";
		res.set('Content-Encoding', 'gzip');
	}
}));

// app.get('/', (req, res) => {
// 	"use strict";
// 	res.send('hello wordl');
// })
server.listen(3000);
console.log('server started');

//socket部分
io.on('connection', socket => {
	"use strict";
	socket.on('login', nickname => {
		console.log('login');
		if(users.indexOf(nickname) != -1) {
			socket.emit('nickExisted');
		} else {
			socket.userIndex = users.length;
			socket.nickname = nickname;
			users.push(nickname);
			socket.emit('loginSuccess');
			io.sockets.emit('system', JSON.stringify({nickname, length: users.length, msg: 'login'})); //向所有用户发送nickname

		}
	});
	socket.on('disconnect', () => {
		users.splice(socket.userIndex, 1);
		//通知除自己以外的所有人
		socket.broadcast.emit('system', JSON.stringify({nickname: socket.nickname, length: users.length, msg: 'logout'}))
	});
	
	//接收文字和emoji
	socket.on('send', (words, color) => {
		socket.broadcast.emit('newMsg', socket.nickname, words, color);
	});
	socket.on('img', (imgData, color) => {
		socket.broadcast.emit('newImg', socket.nickname, imgData, color);
	});
});