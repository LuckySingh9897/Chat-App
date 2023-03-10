const users=[]


const addUser=({id,username,room})=>{
  username= username.trim().toLowerCase();
  room = room.trim().toLowerCase();

//check username and room are filled or not

  if(!username||!room){
    return {
      error : "Username and room are required"
    }
  }
//check if the given username are exist in a same room befor or not
  const existingUser = users.find((user)=>{
    return (user.username==username&&user.room==room);
  })
//if exit return error
  if(existingUser){
    return {
      error : "Username is in use"
    }
  }

  //if not exit add this users
  const user= {id,username,room}
  users.push(user)
  return {user}
}

const removeUser = (id)=>{
  const index= users.findIndex((user)=>{
  return user.id==id;
  })
  if(index!==-1){
    return users.splice(index,1)[0];
  }
}

const  getUser =(id)=>{
  return users.find((user)=>{
    return user.id==id;
  })
}
const getUserInRoom=(room)=>{
  room=room.trim().toLowerCase();
  return users.filter((user)=>{
    return user.room==room;
  })
}

module.exports={
  addUser,
  removeUser,
  getUser,
  getUserInRoom
}
