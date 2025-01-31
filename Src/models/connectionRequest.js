const { type } = require("express/lib/response");
const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromuserId:{
        type : mongoose.Schema.Types.ObjectId,
        require : true,
        ref : "User",
    },
    touserId:{
        type : mongoose.Schema.Types.ObjectId,
        require : true,
        ref:"User",
    },
    status:{
        type:String,
        require:true,
       enum  : {
        values : ["interested","ignored","accepted","rejected"],
        message : `{VALUE} is incorrect status type` 
        },
    }
},
{
    timestamps:true,
}
);

connectionRequestSchema.index({fromuserId:1,touserId:1})

//it will execute the before the save r
connectionRequestSchema.pre("save" , function(next){
    const conncectionrequest = this;

    //check if user send to connection ourself

    if(conncectionrequest.fromuserId.equals(conncectionrequest.touserId)){
          throw new Error("you cannot send a connection request to ourself");
    }

    next();

});

const connectionRequestModel = new mongoose.model("ConnectionRequest",connectionRequestSchema);

module.exports = connectionRequestModel;