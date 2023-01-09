const generateMessage= function(text){
  return {
    text,
    createdAt : new Date().getTime()
  }
}
const generateLocationMessage= function(url){
  return {
    url,
    createdAt: new Date().getTime()
  }
}
module.exports={
  generateMessage,
  generateLocationMessage
}
