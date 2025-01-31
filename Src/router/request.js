const express = require("express");
const requestRouter = express.Router();
const {userAuth } = require('../middlewares/admiAuth');
const connectionRequestModel = require("../models/connectionRequest")
const User = require("../models/user");
const conncetDb = require("../config/database");

requestRouter.post("/request/send/:status/:touserId",userAuth, async(req,res) => {

    try{
        const fromuserId = req.user._id;
        const touserId  = req.params.touserId;
        const status = req.params.status;

       //edge case 1::
        const acceptedList  = ["interested","ignored"];
        if(!acceptedList.includes(status)){
            return res.status(400).json({message : "Invalid Status type : " + status,});
        }
        
        //edge case 2: 
       const existingConnectionRequest = await connectionRequestModel.findOne({
        $or:[
            {fromuserId,touserId},
            {fromuserId:touserId, touserId:fromuserId}
        ]
       });
          
       if(existingConnectionRequest){
        return res.status(400).json({message:"connection request is already exist"});
       }
      
       //edge case 3::
       const touser = await User.findById(touserId);
       if(!touser){
        return res.status(400).send({message:"user does not exist"});
       }
        
       //edges case4
       //usig pre save:: 



        const userconnection =  new connectionRequestModel({
           fromuserId,
           touserId,
           status
        });
          


        const data = await userconnection.save();
        res.json({message : `${req.user.firstName} is  ${status}  ${touser.firstName} `, data});
    }
     catch(err){
        res.status(400).send("Error : " + err.message);
     }
});


requestRouter.post("/request/review/:status/:requestId", userAuth, async(req,res) => {

    try{
        const loggedInUser = req.user;
        // console.log(loggedInUser);
        const {status,requestId} = req.params;
    
        //check for status validation
        const allowedstatus = ["accepted","rejected"];
    
        if(!allowedstatus.includes(status)){
         return  res.status(400).json({message:"Status not Valid"});
        }

       const conncetionRequest = await connectionRequestModel.findOne({
           _id:requestId,
           touserId : loggedInUser._id,
           status:"interested",
       });

       if(!conncetionRequest){
        return res.status(400).json({message:"Connection request not found"});
    }
    conncetionRequest.status = status;

 const data = await conncetionRequest.save();

 res.json({message:"conncetion Request is " + status,data});

    }
    catch(err){
        res.status(400).send("Error : " + err.message);
    }
  
   

});



module.exports = {
    requestRouter
};