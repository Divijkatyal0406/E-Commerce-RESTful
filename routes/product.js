const router=require('express').Router();
const {verifyToken,verifyTokenAndAuthenticate,verifyTokenAndAdmin}=require('./verifyToken');
const CryptoJS=require('crypto-js');
const Product = require('../models/User');


router.post('/',verifyTokenAndAdmin,async(req,res)=>{
    const newProd=new Product(req.body);
    try {
        const saved=await newProd.save();
        res.status(201).json(saved);
    } catch (error) {
        req.json(500).json(error);
    }
})

router.put('/:id',verifyTokenAndAuthenticate,async (req,res)=>{
    try{
        const prod=await Product.findByIdAndUpdate(req.params.id,{
            $set:req.body
        },{new:true});
        res.status(200).json(prod);
    }catch(err){
        res.status(500).json("INVALID");
    }
})


router.delete('/:id',verifyTokenAndAdmin,async (req,res)=>{
    try{
        await Product.findByIdAndDelete(req.params.id)
        res.status(201).json("Deleted Successfully....");
    }catch(err){
        res.status(500).json("INVALID");
    }
})

router.get('/find/:id',verifyTokenAndAdmin,async (req,res)=>{
    try{
        const prod = await Product.findById(req.params.id)
        res.status(201).json(prod);
    }catch(err){
        res.status(500).json("INVALID");
    }
})


router.get('/',verifyTokenAndAdmin,async (req,res)=>{
    try{
        const qnew=req.query.new;
        const qcategory=req.query.category
        let prods;
        if(qnew){
            prods = await Product.find().sort({_id:-1}).limit(5);
        }
        else if(qcategory){
            prods=await Product.find({categories:{
                $in:[qcategory]
            }})
        }
        else{
            prods = await Product.find()
        }
        res.status(201).json(prods);
    }catch(err){
        res.status(500).json("INVALID");
    }
})

module.exports=router;