const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const Filter = require("bad-words");
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')
const {
  generateMessage,
  generateLocationMessage
} = require('./utils/message')

const {addUser, removeUser, getUser, getUserInRoom} = require('./utils/users')
app.use(express.static(publicDirectoryPath))

io.on('connection', function(socket) {
  console.log("New Websocket Connection");


  socket.on("Join", ({  username,room} ,callback) => {
    const {error ,user}= addUser({id:socket.id ,username,room})
    if(error){
      return callback(error)
    }
    socket.join(user.room)
    socket.emit('Message', generateMessage('Welcome!'));
    socket.broadcast.to(user.room).emit('Message', generateMessage(user.username + ' has joined!'));
    callback()
  })


  socket.on('sendMessage', function(message, callback) {



    const filter = new Filter();
    if (filter.isProfane(message)) {
      return callback('Profanity is not allowed!');
    }
    io.emit('Message', generateMessage(message));
    callback();
  })

  socket.on('sendLocation', (coords, callback) => {



    io.emit('locationMessage', generateLocationMessage('http://google.com/maps?q=' + coords.latitude + ',' + coords.longitude));
    callback();
  })
  socket.on('disconnect', function() {

  const user=  removeUser(socket.id)
if(user){
    io.to(user.room).emit('Message', generateMessage( user.username + ' has left'));}
  })

})

server.listen(3000, function() {
  console.log("Server is up on  port  ${port}!");
});
