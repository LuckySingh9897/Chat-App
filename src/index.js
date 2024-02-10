const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const Filter = require("bad-words");
const app = express();


//creating a server side 
const server = http.createServer(app);

//
//call this to make it functional for server
const io = socketio(server);

//
const port = process.env.PORT || 3000

//dynamically connect a path to public directory
const publicDirectoryPath = path.join(__dirname, '../public')


const {
  generateMessage,
  generateLocationMessage
} = require('./utils/message')



const {addUser, removeUser, getUser, getUserInRoom} = require('./utils/users')
app.use(express.static(publicDirectoryPath))




//whenever socketio gets a connection if it gets a new connection request it gets fired
io.on('connection', function(socket) {
  console.log("New Websocket Connection");






  socket.on("Join", ({  username,room} ,callback) => {
    const {error ,user}= addUser({id:socket.id ,username,room})
    if(error){
      return callback(error)
    }
    socket.join(user.room)
    socket.emit('Message', generateMessage('Admin','Welcome!'));
    socket.broadcast.to(user.room).emit('Message', generateMessage('Admin',user.username + ' has joined!'));
io.to(user.room).emit('roomData',{
  room : user.room,
  users : getUserInRoom(user.room)
})

    callback()
  })

   


//callback function is send by an emitter (client side) here server recieve and call this function as acknolodegment of recieving the message

  socket.on('sendMessage', function(message, callback) {

    const filter = new Filter();
    if (filter.isProfane(message)) {
      return callback('Profanity is not allowed!');
    }

    const user=getUser(socket.id);

    io.to(user.room).emit('Message', generateMessage(user.username,message));
    callback();
  })




  socket.on('sendLocation', (coords, callback) => {

const user= getUser(socket.id);

    io.to(user.room).emit('locationMessage', generateLocationMessage(user.username,'http://google.com/maps?q=' + coords.latitude + ',' + coords.longitude));
    callback();
  })





  socket.on('disconnect', function() {

  const user=  removeUser(socket.id)
if(user){
    io.to(user.room).emit('Message', generateMessage('Admin', user.username + ' has left'));

   io.to(user.room).emit('roomData',{
     room : user.room,
     users : getUserInRoom(user.room)
   })
  }
  })

})






server.listen(3000, function() {
  console.log("Server is up on  port  ${port}!");
});
