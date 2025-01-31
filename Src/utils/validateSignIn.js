const validator = require("validator");
const { default: isEmail } = require("validator/lib/isEmail");

const validateSignIn = (req)=>{
 const {emailId, password}  = req.body;

 if(!emailId || !password){
    throw new Error("Invalid Credentials");
 }
 if(!validator.isEmail(emailId)){
    throw new Error("Enter a valid email Id");
 }
 if(!validator.isStrongPassword(password)){
    throw new Error("invalid Credentials");
 }
};


module.exports = {
    validateSignIn,
}