const socket = io()

const $messageForm = document.querySelector('#message-form');
const $messageForminput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');



const $locationButton = document.querySelector('#Send-Location');
const $message = document.querySelector('#message');


const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationmessageTemplate = document.querySelector('#location-message-template').innerHTML;



const sidebarTemplate=document.querySelector('#sidebar-template').innerHTML;


const {username,room}=Qs.parse(location.search, {ignoreQueryPrefix:true})//ignore the ? in the url
console.log(Qs.parse(location.search, {ignoreQueryPrefix:true})) ;



const autoscroll=()=>{

  const $newMessage= $message.lastElementChild

  const newMessageStyles= getComputedStyle($newMessage)
  const newMessageMargin= parseInt(newMessageStyles.marginBottom)
  const newMessageHeight= $newMessage.offsetHeight+ newMessageMargin

  const visibleHeight= $message.offsetHeight
  const containerHeight= $message.scrollHeight

  const scrollOffset=  $message.scrollTop +visibleHeight

  if(containerHeight-newMessageHeight<=scrollOffset){
    $message.scrollTop= $message.scrollHeight
  }
}




//render the location 

socket.on('locationMessage', function(message) {

  console.log(message);
  const html = Mustache.render(locationmessageTemplate, {
    username : message.username,
    url:message.url
    , timeLocation: moment(message.createdAt).format('h:mm:a')
  });
  $message.insertAdjacentHTML('beforeend', html);

  autoscroll()

})




//used Mustache node js library for rendering message.....
socket.on('Message', function(message) {
  console.log(message);
  /////passed what message should be rendered in to the message template
  const html = Mustache.render(messageTemplate, {
    username: message.username,
    time:  moment(message.createdAt).format('h:mm:a')// moment librarry is used to format the timespan
  ,  message1: message.text

  });
  $message.insertAdjacentHTML('beforeend', html);// where should be the message rendered
autoscroll()
})





socket.on('roomData',function({room, users}){
   const html=  Mustache.render(sidebarTemplate,{
     room,
     users
   })
   document.querySelector('#sidebar').innerHTML=html
})






//sending the message in the room...........................

document.querySelector("#message-form").addEventListener('submit', function(e) {

  e.preventDefault()    //prevent the default behaviour of browser of  refreshing the page

  $messageFormButton.setAttribute('disabled', 'disabled');//diabled the send button


  const message = document.querySelector('input').value;

  socket.emit('sendMessage', message, (error) => {

    $messageFormButton.removeAttribute('disabled');//enabled the send button
    $messageForminput.value = '';// make the input box empty
    $messageForminput.focus();  // bring back the cursor into the box as it was initiallly
    if (error) {
      return console.log(error);
    }

    console.log('Message Delievered!');


  });
})





//send the location


document.querySelector("#Send-Location").addEventListener('click', function() {
  if (!navigator.geolocation) {
    return alert("Your browser do not support geolocation");
  }

  $locationButton.setAttribute('disabled', 'disabled');// disabled the send location button

  navigator.geolocation.getCurrentPosition((position) => {

    console.log(position);

    socket.emit('sendLocation', {

      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    }, () => {
      $locationButton.removeAttribute('disabled');  // send location enabled
      console.log('Location Shared!');
    });
  })


})



// console.log(username)
socket.emit('Join',{username,room},(error)=>{
if(error){
  alert(error);
  location.href="/"
}
});
