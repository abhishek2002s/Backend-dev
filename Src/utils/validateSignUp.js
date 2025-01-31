const validator = require("validator");
const bcrypt = require("bcrypt");


const validateSignUp = (req) => {
  
    const {password,emailId} = req.body;

    if(!validator.isEmail(emailId)){
        throw new Error("Please enter a email Id");
    }
    if(!validator.isStrongPassword(password)){
        throw new Error("Please Enter a strong password");
    }
};

const userValidateEdit = (req) => {
    const isEditableField = ["firstName", "lastName","skills", "about", "gender", "age", "photoUrl"];

  const isEditable =   Object.keys(req.body).every(field => isEditableField.includes(field));

  return isEditable;
}

const validateIsEditPassword = (req) => {
    const isEditableField = ["password","oldpassword"]

    const isEditablePass = Object.keys(req.body).every(key => isEditableField.includes(key));
 
    return isEditablePass;
}

module.exports = {
    validateSignUp,
    userValidateEdit,
    validateIsEditPassword
}