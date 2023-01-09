const socket = io()

const $messageForm = document.querySelector('#message-form');
const $messageForminput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $locationButton = document.querySelector('#Send-Location');
const $message = document.querySelector('#message');


const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationmessageTemplate = document.querySelector('#location-message-template').innerHTML;
socket.on('locationMessage', function(message) {

  console.log(message);
  const html = Mustache.render(locationmessageTemplate, {
    url:message.url
    , timeLocation: moment(message.createdAt).format('h:mm:a')
  });
  $message.insertAdjacentHTML('beforeend', html);

})
socket.on('Message', function(message) {
  console.log(message);
  const html = Mustache.render(messageTemplate, {
    time:  moment(message.createdAt).format('h:mm:a')
  ,  message1: message.text

  });
  $message.insertAdjacentHTML('beforeend', html);

})

document.querySelector("#message-form").addEventListener('submit', function(e) {
  e.preventDefault()
  $messageFormButton.setAttribute('disabled', 'disabled');


  const message = document.querySelector('input').value;

  socket.emit('sendMessage', message, (error) => {

    $messageFormButton.removeAttribute('disabled');
    $messageForminput.value = '';
    $messageForminput.focus();
    if (error) {
      return console.log(error);
    }

    console.log('Message Delievered!');


  });
})

document.querySelector("#Send-Location").addEventListener('click', function() {
  if (!navigator.geolocation) {
    return alert("Your browser do not support geolocation");
  }

  $locationButton.setAttribute('disabled', 'disabled');

  navigator.geolocation.getCurrentPosition((position) => {

    console.log(position);

    socket.emit('sendLocation', {

      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    }, () => {
      $locationButton.removeAttribute('disabled');
      console.log('Location Shared!');
    });
  })

})
