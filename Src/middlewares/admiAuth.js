const { cookie } = require("express/lib/response");
const JWT  =  require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req,res,next) => {

    try{
  const cookies = req.cookies;

  const {token} = cookies;

  if(!token ){
    return res.status(401).send("Please LogedIn.....");
  }

  const DecodedMessage = await JWT.verify(token,"DevTinder@123"); 
  const {_id} = DecodedMessage;

  const user = await User.findById(_id);
  if(!user){
    throw new Error("User does not exist");
  }
        
  req.user = user;
  next();
}
catch(err){
    res.status(400).send("Error : " + err.message);
}
}

module.exports = {
    userAuth
}