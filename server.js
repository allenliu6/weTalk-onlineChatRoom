var http = require('http'),
    sio = require('socket.io'),
    express = require('express'),
    app = express(),
    server = http.createServer(app),
    userList = {}

app.get('/', function(req, res){
    res.sendfile(__dirname + '/index.html')
})
server.listen(3000)

var io = sio.listen(server)

io.sockets.on('connection', function(socket){
    socket.on('login', function(name, fn){
        socket.name = name
        userList[name] = true
        fn(name)
        io.sockets.emit('login', {userList, name})
    })
    socket.on('logout', function(name){
        delete userList[name]
        io.sockets.emit('logout', name) 
    })
    socket.on('message', function(msg){
        io.sockets.emit('message', {name: socket.name, message: msg})
    })
    socket.on('disconnect', function(){
        delete userList[socket.name]
        io.sockets.emit('logout', socket.name)
    })
})
