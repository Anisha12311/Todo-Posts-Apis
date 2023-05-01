import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name: {type : String, required :true},
    email : {type : String, required: true},
    password : {type : String, required: true},
    roles: [{
        type: String,
        enum: ["user", "admin"],
        default: "user"
      }],
    createdAt:{type : Date, default : Date.now},
    updatedAt : {type : Date, default : Date.now}
})

module.exports = mongoose.model('User',userSchema)