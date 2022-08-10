const server = require('http').createServer()
const express = require("express");
const io = require("socket.io")(server,);
const server_port = process.env.PORT || 3000;

  const app = express();
  app.use(express.json());

  
  let activeUsers = [];
  
  io.on("connection", (socket) => {

    console.log(" new user Connected to the Server!!!")
    // add new User
    socket.on("new-user-add", async(newUserId) => {
      try {
        console.log("connected userId ",newUserId)

      console.log(newUserId)
      } catch (error) {
        console.log("error",error);
      }
      
      // if user is not added previously
      if (!activeUsers.some((user) => user.userId === newUserId)) {
        activeUsers.push({ userId: newUserId, socketId: socket.id });
        console.log("New User Connected", activeUsers);
      }
      // send all active users to new user
      io.emit("get-users", activeUsers);
    });


    //send message

    socket.on("send-message", (data)=>{
      console.log("sending message",data)
      socket.emit(data)
      const datas= JSON.parse(data)
        const {recieverId} = datas;
        // const duplicates = activeUsers.filter(function(val) {
        //   return recieverId.indexOf(val.userId) != -1; 
        // });
        // console.log("dupli",duplicates);
        // duplicates.forEach(element => {
          io.to(recieverId).emit("recieve-message", data)

          console.log(data);
        // });
    })

  

    socket.on("disconnect", () => {
        // remove user from active users
        activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
        console.log("User Disconnected", activeUsers);
        // send all active users to all users
        io.emit("get-users", activeUsers);
      });
})
app.route("/").get((req,res)=>{
  return res.JSON("Cinephile Movie Community");
 
 });

server.listen(server_port,"0.0.0.0" , () =>{

  console.log('Listening on port %d', server_port);
});