const express = require("express");
const User = require('../models/user');
const authRouter = express.Router();
const {validateSignIn} = require("../utils/validateSignIn");
const {validateSignUp} = require("../utils/validateSignUp");
const bcrypt = require("bcrypt");


authRouter.post("/signUp",async (req,res) => {
    
    try{

//encrypting password
validateSignUp(req);

const {firstName, lastName,emailId, password} = req.body;

const passwordHash = await bcrypt.hash(password,10);


const user = new User(
    {
        firstName,
        lastName,
        emailId,
        password:passwordHash
    });
    
       const newUser =   await user.save();
       const token = await newUser.getJWT();
         res.cookie("token",token,{expires:new Date(Date.now() + 7 * 3600000)});

         res.json({message : "user added successfully", data : newUser});
     }
     catch(err){
        res.status(400).send("Error : " + err.message);
     }

});

authRouter.post("/LogIn",async (req,res) => {
    try{
        validateSignIn(req);
        const {emailId, password} = req.body;

        const user = await User.findOne({emailId :emailId});
        if(!user){
            throw new Error("Invalid Credentials");
        }
        const isPasswordValid = await user.passwordValid(password);

        if(isPasswordValid){
            //creating a JWT token 
            const token = await user.getJWT();
              res.cookie("token",token,{expires:new Date(Date.now() + 7 * 3600000)});
              res.send(user);
        }
        else{
            throw new Error("invalid Credentilas");
        }
    }
    catch(err){
           res.status(400).send("Error : " +err.message);
    }
    }
)

authRouter.post("/logout", async(req,res) => {
    res.cookie("token", null, {
     expires :new Date(Date.now())
    });

    res.send("Logout successfully......");
});


module.exports = {
    authRouter
}