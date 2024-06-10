const User = require('../models/user.model')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const {SECRET} = require('../config/server.config')



async function signup(req , res){ 
    try {                           
        const {fullname , email , password , confirm_password} = req.body;
        if(!fullname || !email || !password || !confirm_password) {
            console.log("missing fields");
            return res.status(400).json({message: "All fields are required" })
        }
        if (password !== confirm_password) {
            console.log("password not matched");
            return res.status(401).json({ message: "Passwords do not match" });
        }

        const existingUser = await User.findOne({email});
        if(existingUser){
            console.log('user is already exist');
           return res.status(402).json({message:"User already exist"})
        }
        const hashedPassword = await bcrypt.hash(password , 10) ;
        
        const NewUser = new User({
            fullname,
            email ,
            password:hashedPassword,
        })
        await NewUser.save();
        const token = jwt.sign({email , fullname },SECRET , {expiresIn:"2h"});
        console.log("user token",token);
        console.log("new user signup");
        return res.status(200).json({ message: "User signed up successfully" , users:{
            token: token,
            email:email,
            username:fullname,
        }});
    
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
const login = async(req , res) =>{
    console.log("login request body",req.body);
       try {
        const {email , password} = req.body;
        if (!email || !password) {
            console.log("missing fields");
            return res.status(400).json({ message: "Email and password are required" });
        }
        const userDetails = await User.findOne({email:email})
        if(userDetails){
            console.log("password of user login",(typeof password),'----->',(typeof userDetails.password));
            const isMatch =await bcrypt.compare(password , userDetails.password);
            if(isMatch){
                const token = jwt.sign({email , username:userDetails.fullname} , SECRET ,{expiresIn:'2h'});
                console.log("password matched");
                console.log("user signin");
                
                return res.status(200).json({message:"logged in" , users:{
                    token: token,
                    email:email,
                    username:userDetails.fullname,
                }})
            }else{
                console.log("password does not match");
                return res.status(401).json({message:'password does not match'})
            }
        }
        else{
            console.log("create your account first");
            res.status(403).json({message:"user does not found"})
        }
        
       } catch (error) {
        console.log(error);
        return res.status(500).json({error:'Server Error'})
       }
}

module.exports = {
    login ,
    signup
}
