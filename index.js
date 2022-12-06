const express=require('express');
const app=express();
const mongoose=require('mongoose');
const dotenv=require('dotenv');
const userRoute=require('./routes/user');
const AuthRoute=require('./routes/auth');
const productRoute=require('./routes/product');
dotenv.config();

mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("Successful")
}).catch((err)=>{console.log(err)});

// app.get("/api/test",()=>{
//     console.log("Test");
// })

app.use(express.json());

app.use("/api/users",userRoute);
app.use("/api/auth",AuthRoute);
app.use("/api/products",productRoute);


app.listen(process.env.PORT || 5000,()=>{
    console.log("Server Running");
})