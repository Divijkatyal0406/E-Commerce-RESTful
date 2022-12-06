const jwt=require('jsonwebtoken');
const dotenv=require('dotenv');
dotenv.config();

const verifyToken=(req,res,next)=>{
    const authHeader=req.headers.token;
    if(authHeader){
        const token=authHeader.split(" ")[1];
        jwt.verify(token,process.env.SECRET,(err,user)=>{
            if(err){
                res.status(403).json("Invalid token");
            }
            else{
                req.user=user;
                next();
            }
        });
    }
    else{
        return res.status(401).json("Invalid user");
    }
} 

const verifyTokenAndAuthenticate=(req,res,next)=>{
    verifyToken(req,res,()=>{
        if(req.user.id===req.params.id || req.user.isAdmin){
            next();
        }   
        else{
            res.status(403).json("INVALID");
        }
    })
} 

const verifyTokenAndAdmin=(req,res,next)=>{
    verifyToken(req,res,()=>{
        if(req.user.isAdmin){
            next();
        }   
        else{
            res.status(403).json("INVALID");
        }
    })
} 

module.exports={verifyToken,verifyTokenAndAuthenticate,verifyTokenAndAdmin};