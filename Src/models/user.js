const mongoose = require('mongoose');
const validator = require('validator');
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    firstName:{
        type : String,
        required : true,
        minlength : 3,
    },
    lastName:{
        type:String,
        required : true,
    },
    age:{
        type:Number,
        min:18,
        validator(value){
            if(!validator.isInt(value)){
                throw new Error("please enter a valid age " + value);
            }
        }
    },
    emailId:{
        type:String,
        required : true,
        unique : true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Please enter a valid Email " + value);
            }
        }
    },
    password:{
        type:String,
        required: true,
        unique: true,
        validator(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("please choose a strong password" + value);
            }
        }
    },
    about:{
        type:String,
        default : "Hey i am a person looking for a job"
    },

    photoUrl:{
        type:String,
        default :"https://img.freepik.com/premium-vector/portrait-young-man_684058-1091.jpg",
    },
    gender:{
        type:String,
        validate(value){
            if(!["male","female","other"]){
                throw new Error("Gender is not valid");
            } 
        }
    },
    skills:{
        type:[String],
    },
},
{
    timestamps : true,
}
);

userSchema.methods.getJWT= async function() {
    const user = this;

    const token  = await JWT.sign({_id:user._id},"DevTinder@123",{
                    expiresIn:"7d",
                });

                return token;
};

userSchema.methods.passwordValid = async function (passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;
    const isPasswordvalid = await bcrypt.compare(passwordInputByUser,passwordHash);

    return isPasswordvalid;
};



const User = mongoose.model("User",userSchema);
module.exports = User;