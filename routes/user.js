const router=require('express').Router();
const { findByIdAndUpdate, findByIdAndDelete } = require('../models/User');
const {verifyToken,verifyTokenAndAuthenticate,verifyTokenAndAdmin}=require('./verifyToken');
const CryptoJS=require('crypto-js');
const User = require('../models/User');


router.put('/:id',verifyTokenAndAuthenticate,async (req,res)=>{
    if(req.body.password){
        req.body.password=CryptoJS.AES.encrypt(req.body.password, process.env.SECRET).toString();
    }
    try{
        const updatedUser=await User.findByIdAndUpdate(req.params.id,{
            $set:req.body
        },{new:true});
        res.status(200).json(updatedUser);
    }catch(err){
        res.status(500).json("INVALID");
    }
})


router.delete('/:id',verifyTokenAndAuthenticate,async (req,res)=>{
    try{
        await User.findByIdAndDelete(req.params.id)
        res.status(201).json("Deleted Successfully....");
    }catch(err){
        res.status(500).json("INVALID");
    }
})

router.get('/find/:id',verifyTokenAndAdmin,async (req,res)=>{
    try{
        const user = await User.findById(req.params.id)
        const {password,isAdmin,...others}=user._doc;
        res.status(201).json({...others});
    }catch(err){
        res.status(500).json("INVALID");
    }
})


router.get('/',verifyTokenAndAdmin,async (req,res)=>{
    try{
        const query=req.query.new;
        const users = query? await User.find().sort({_id:-1}).limit(5) : await User.find()
        res.status(201).json(users);
    }catch(err){
        res.status(500).json("INVALID");
    }
})


router.get('/stats',verifyTokenAndAdmin,async (req,res)=>{
    const date=new Date();
    const lastYear=new Date(date.setFullYear(date.getFullYear()-1));
    try{
        const data=await User.aggregate([
            {$match:{createdAt:{$gte:lastYear}}},
            {
                $project:{
                    month:{$month:"$createdAt"}
                }
            },
            {
                $group:{
                    _id:"$month",
                    total:{$sum:1}
                }
            }
        ])
        res.status(201).json(data);
    }catch(err){
        res.status(500).json("INVALID");
    }
})



module.exports=router;