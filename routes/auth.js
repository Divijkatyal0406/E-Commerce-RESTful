const User = require('../models/User');

const router=require('express').Router();
const CryptoJS=require('crypto-js');
const dotenv=require('dotenv');
const jwt=require('jsonwebtoken');
dotenv.config();


//Register
router.post("/register",async (req,res)=>{
    const newUser=new User({
        username:req.body.username,
        email:req.body.email,
        password:CryptoJS.AES.encrypt(req.body.password, process.env.SECRET).toString(),
    });

    try{
        const savedUser=await newUser.save();
        res.status(201).json(savedUser);
    }catch(err){
        res.status(500).json(err);
    }
})

//Login
router.post("/login",async (req,res)=>{
    try{
        const exixtingUser=await User.findOne({username:req.body.username});
        !exixtingUser && res.send(401).json("Wrong credentials");

        const hash=CryptoJS.AES.decrypt(exixtingUser.password, process.env.SECRET);
        const passwd=hash.toString(CryptoJS.enc.Utf8);

        (passwd!==req.body.password) && res.send(401).json("Wrong credentials");

        const accessToken=jwt.sign({id:exixtingUser._id,isAdmin:exixtingUser.isAdmin},process.env.SECRET,{expiresIn:"3d"});

        const {password,...others}=exixtingUser._doc;

        res.status(200).json({...others,accessToken});
    }catch(err){
        res.status(500).json(err);
    }
})

module.exports=router;