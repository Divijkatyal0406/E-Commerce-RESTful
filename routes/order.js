const router=require('express').Router();
const {verifyToken,verifyTokenAndAuthenticate,verifyTokenAndAdmin}=require('./verifyToken');
const CryptoJS=require('crypto-js');
const Order = require('../models/Order');


router.post('/',verifyToken,async(req,res)=>{
    const order=new Order(req.body);
    try {
        const saved=await order.save();
        res.status(201).json(saved);
    } catch (error) {
        req.json(500).json(error);
    }
})

router.put('/:id',verifyTokenAndAdmin,async (req,res)=>{
    try{
        const order=await Order.findByIdAndUpdate(req.params.id,{
            $set:req.body
        },{new:true});
        res.status(200).json(order);
    }catch(err){
        res.status(500).json("INVALID");
    }
})


router.delete('/:userId',verifyTokenAndAdmin,async (req,res)=>{
    try{
        await Order.findByIdAndDelete({userId:req.params.id})
        res.status(201).json("Deleted Successfully....");
    }catch(err){
        res.status(500).json("INVALID");
    }
})

router.get('/find/:userId',verifyTokenAndAuthenticate,async (req,res)=>{
    try{
        const order = await Order.findOne({userId:req.params.userId})
        res.status(201).json(order);
    }catch(err){
        res.status(500).json("INVALID");
    }
})


router.get('/',verifyTokenAndAdmin,async (req,res)=>{
    try{
        const orders = await Order.find()
        res.status(201).json(orders);
    }catch(err){
        res.status(500).json("INVALID");
    }
})

router.get('/income',verifyTokenAndAdmin,async (req,res)=>{
    const date=new Date();
    const lastMonth=new Date(date.setMonth(date.getMonth()-1));
    const prevMonth=new Date(new Date().setMonth(lastMonth.getMonth()-1));
    try{

        const income=await Order.aggregate([
            {$match:{createdAt:{$gte:prevMonth}}},
            {
                $project:{
                    month:{$month:"$createdAt"},
                    sales:"$amount"
                }
            },
            {
                $group:{
                    _id:"$month",
                    total:{$sum:"$sales"}
                }
            }
        ])
        res.status(201).json(income);
    }catch(err){
        res.status(500).json("INVALID");
    }
})

module.exports=router;