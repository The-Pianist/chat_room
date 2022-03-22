const mongoose=require("mongoose");
const bcrypt=require("bcrypt");
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        require:true,
    },
    email:{
        type:String,
        require:true,
        unique:true,
        lowercase:true,
    },
    password:{
        type:String,
        reqiure:true,
        minlength:6
    },
})

userSchema.pre("save", async function(next){
    const salt=await bcrypt.genSalt();
    this.password=await bcrypt.hash(this.password,salt);
    console.log("Before Save", this);
    next();
})


userSchema.post("save", function(doc,next){
    console.log("after save", doc)
    next();
})

userSchema.statics.login=async function(email, password){
    const user=await this.findOne({email});
    if(user){
        const isAuthenticated=await bcrypt.compare(password, user.password);
        if(isAuthenticated){
            return user;
        }else{
            throw Error("Incorrect password");
        }
    }else{
        throw Error("incorrect email")
    }
}

const User=mongoose.model("user",userSchema);
module.exports=User;