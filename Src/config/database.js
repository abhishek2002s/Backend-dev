const mongoose = require('mongoose');

 const conncetDb = async () => {
  await  mongoose.connect("mongodb+srv://abhisheksoni2002feb:LtmRubHMCWC98PEK@cluster0.qsi8g.mongodb.net/devTinder");
 }
module.exports = conncetDb;