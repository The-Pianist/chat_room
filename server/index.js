const express=require("express");
const authRoutes=require("./routes/authRoute");
const cookieParser=require("cookie-parser");;
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const cors=require("cors");
const PORT = process.env.PORT || 8000;
const mongoDB="mongodb+srv://pianist:ggininder@cluster0.yohx1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const mongoose=require("mongoose");
const Room=require("./models/Room");
const Message=require("./models/Message");
const {addUser, removeUser, getUser}=require("./helper")

mongoose.connect(mongoDB,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(()=>{
    console.log("Connected to MongoDb")
}).catch(err=>{
    console.log(`Error in connecting mongoDB, the error is ${err}`);
})

app.use(cors({
    origin:"http://localhost:3000",
}));
app.use(express.json());
app.use(cookieParser());
app.use(authRoutes);

app.get("/set-cookies",(req,res)=>{
    res.cookie('username',"tommy");
    res.cookie("isAuthenticated", true,{httpOnly:true})
})

app.get("/get-cookies",(req,res)=>{
    const cookies=req.cookies;
    res.json(cookies);
})

io.on('connection', (socket) => {
    Room.find().then(result=>{
        
        socket.emit("output-rooms", result);
    })
    socket.on("create-room",name=>{
        console.log("the room name received is: ", name);
        const room=new Room({name});
        room.save().then((result)=>{
            io.emit("room-created",result);
        })
    })

    socket.on("join",({name, room_id, user_id})=>{
        const {error,user}=addUser({
            socket_id:socket.id,
            name,
            room_id,
            user_id
        })
        console.log("Joined new user");
        socket.join(room_id);
        if(error){
            console.log("Join error",error);
        }else{
            console.log("Join success",user);
        }
    })
    socket.on("sendMessage",(message, room_id, callback)=>{
        console.log(socket.id);
        const user=getUser(socket.id);
        console.log(user);
        const msgToStore={
            name: user.name,
            user_id:user.user_id,
            text:message,
            room_id: room_id,
            
        }
        console.log(`message`, msgToStore)
        const msg=new Message(msgToStore);
        msg.save().then(result=>{
            io.to(room_id).emit("message",result);
            console.log("message sent");
            callback();
        })
        
    })

    socket.on('get-messages-history', room_id => {
        Message.find({ room_id }).then(result => {
            socket.emit('output-messages', result)
        })
    })

    socket.on("disconnet",()=>{
        const user=removeUser(socket.id);
    })
});

server.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});