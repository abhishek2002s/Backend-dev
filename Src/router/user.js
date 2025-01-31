const express = require("express");
const { userAuth } = require("../middlewares/admiAuth");
const connectionRequestModel = require("../models/connectionRequest");
const { status } = require("express/lib/response");
const User = require("../models/user");
const userRouter = express.Router();
const USER_SAVE_DATA = "firstName lastName age gender about skills photoUrl";


userRouter.get("/user/requests/recieved",userAuth, async(req,res) => {
    try{
        const LoggedInUser = req.user;

        const connectionRequest = await connectionRequestModel.find({
            touserId:LoggedInUser._id,
            status : "interested",
        }).populate("fromuserId",["firstName","lastName","age","gender","about","skills","photoUrl"]);


        res.json({message:"Data fetched Successfully", data:connectionRequest});
    }
    catch(err){
        res.status(400).send("Error : " + err.message);
    }

});


userRouter.get("/user/connection", userAuth, async(req,res) => {
try{
         const LoggedInUser = req.user;

         const connectionRequest = await connectionRequestModel.find({
            $or:[
                {touserId : LoggedInUser._id,status:"accepted"},
                {fromuserId : LoggedInUser._id, status : "accepted"},
            ]
         }).populate("fromuserId",USER_SAVE_DATA).populate("touserId", USER_SAVE_DATA);


         const data = connectionRequest.map((row) => {
            if(row.touserId._id.toString() === LoggedInUser._id.toString()){
                return row.fromuserId;
            }
            return row.touserId;
         })

         res.json({data});
}

catch(err){
  res.status(400).send("Error : " + err.message);
}
});


userRouter.get("/feed", userAuth, async(req,res) => {
    try{
    const loggedInUser = req.user;

    const page= parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip  = (page-1)*limit;

    //find all connectionRequests
    const connectionRequests = await connectionRequestModel.find({
        $or:[
            {touserId : loggedInUser._id},
            {fromuserId : loggedInUser._id},
        ],
    }).select("fromuserId touserId");

    //give logic to hideuser
    const hideUserfromFeed = new Set();

    connectionRequests.forEach(req => {
        hideUserfromFeed.add(req.fromuserId.toString());
        hideUserfromFeed.add(req.touserId.toString());
    });


     
    const data = await User.find({
        $and:[
            {_id:{$nin : Array.from(hideUserfromFeed)}},
            {_id : {$ne : loggedInUser._id}},
        ]
    }).select(USER_SAVE_DATA).skip(skip).limit(limit);


    res.send(data);
    }
    catch(err){
        res.status(400).json({message:err.message});
    }
})

module.exports = userRouter;