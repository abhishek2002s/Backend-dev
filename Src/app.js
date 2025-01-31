const express = require('express');
const conncetDb = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const { authRouter } = require('./router/auth');
const { requestRouter } = require('./router/request');
const { profileRouter } = require('./router/profile');
const userRouter = require('./router/user');
const cors = require("cors");
const portNo = 7777;

app.use(cors({
    origin : "http://localhost:5173",
    credentials:true,
}));
app.use(express.json());
app.use(cookieParser());


app.use("/", authRouter);
app.use("/",requestRouter);
app.use("/",profileRouter);
app.use("/",userRouter);

//to  capture all data
app.get("/feed",async (req,res) => {
    
    const allUser = await User.find({});

    try{
         if(allUser.length === 0){
            res.status(404).send("no user present");
         }
         else{
            res.send(allUser);
         }
    } 
    catch(err){
        res.status(401).send("Error:" +err.message);
    }
})


conncetDb()
.then( () =>{
    console.log("Connection to database successfully");
    app.listen(portNo, () => {
        console.log("Server is listening at port no : ",portNo);
    })
})
.catch(err => console.error("Conncection is not established"));


