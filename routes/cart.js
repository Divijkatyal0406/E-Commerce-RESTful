const router=require('express').Router();
const {verifyToken,verifyTokenAndAuthenticate,verifyTokenAndAdmin}=require('./verifyToken');
const CryptoJS=require('crypto-js');
const Cart = require('../models/Cart');


router.post('/',verifyToken,async(req,res)=>{
    const cart=new Cart(req.body);
    try {
        const saved=await cart.save();
        res.status(201).json(saved);
    } catch (error) {
        req.json(500).json(error);
    }
})

router.put('/:id',verifyTokenAndAuthenticate,async (req,res)=>{
    try{
        const cart=await Cart.findByIdAndUpdate(req.params.id,{
            $set:req.body
        },{new:true});
        res.status(200).json(cart);
    }catch(err){
        res.status(500).json("INVALID");
    }
})


router.delete('/:userId',verifyTokenAndAdmin,async (req,res)=>{
    try{
        await Cart.findByIdAndDelete({userId:req.params.id})
        res.status(201).json("Deleted Successfully....");
    }catch(err){
        res.status(500).json("INVALID");
    }
})

router.get('/find/:userId',verifyTokenAndAuthenticate,async (req,res)=>{
    try{
        const cart = await Cart.findOne({userId:req.params.userId})
        res.status(201).json(cart);
    }catch(err){
        res.status(500).json("INVALID");
    }
})


router.get('/',verifyTokenAndAdmin,async (req,res)=>{
    try{
        const carts = await Cart.find()
        res.status(201).json(carts);
    }catch(err){
        res.status(500).json("INVALID");
    }
})

module.exports=router;