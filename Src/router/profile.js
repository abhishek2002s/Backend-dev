const express = require("express");
const profileRouter = express.Router();
const {userAuth } = require('../middlewares/admiAuth');
const {userValidateEdit} = require("../utils/validateSignUp");
const {validateIsEditPassword} = require("../utils/validateSignUp");
const bcrypt = require("bcrypt");
const {User}  = require("../models/user")

profileRouter.get("/profile/view",userAuth, async(req,res) => {

    try{

     const user = req.user;
  res.send(user);

    }
    catch(err){
        res.status(400).send("Error : "+err.message);
    }
});;

profileRouter.patch("/profile/edit", userAuth , async(req,res) => {
   try{
       if(!userValidateEdit(req)){
        throw new Error("You not allowed to updated these fields");
       }

       const LoggedInuser = req.user;
    
     Object.keys(req.body).forEach((field) => {
                   (LoggedInuser[field] = req.body[field]);
       })

       res.send({
        message : `${LoggedInuser.firstName} your profile updated successfully..`,
        data : LoggedInuser,

    });

    await LoggedInuser.save();
   }
   catch(err){
        res.status(400).send("error : " + err.message);   }
})

profileRouter.patch("/profile/passwordReset", userAuth, async(req,res) => {
   try{
    if(!validateIsEditPassword(req)){
        throw new Error("Invalid credentials");
    }
 
    const {password, oldpassword} = req.body;
    const user = req.user;

    const isPasswordCorrect = await user.passwordValid(oldpassword);

   if(!isPasswordCorrect){
    throw new Error("You entered wrong password..");
   }
     
   const newPasswprd = await bcrypt.hash(password,10);

   req.user.password = newPasswprd;

   user.save();
 
   res.send("Password  updated successfully");
}

catch(err){
 res.status(400).send("Error : " + err.message);
}
})
module.exports  = {
    profileRouter
};









