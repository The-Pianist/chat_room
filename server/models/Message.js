const mongoose=require("mongoose");
const messageSchema=new mongoose.Schema({
    name:{
        type:String,
        require:true,
    },
    user_id:{
        type:String,
        require:true,
    },
    text:{
        type:String,
        require:true,
    },
    room_id:{
        type:String,
        reuqire:true,
    },
}, {timestamps:true})
const Message=mongoose.model('message',messageSchema);
module.exports=Message;