import express from "express"
import User from "../models/User.js"
import jwt from "jsonwebtoken"

const router = express.Router();

const generateToken = (userId) => {
    return jwt.sign({userId},process.env.JWT_SECRET,{expiresIn: "15d"})
}

router.post("/register",async(req,res)=>{
    try {
        const {email,username,password} = req.body  
        if(!username || !email || !password) {
            return res.status(400).json({ message: "All Fields are Required!"});
        }  
        if(password.length<6){
            return res.status(400).json({ message: "Password should be at least 6 characters long!"});
        }
        if(username.length<3){
            return res.status(400).json({ message: "Username should be at least 3 characters long!"});
        }
        const existingEmail = await User.findOne({$or:[{email}]});
        if(existingEmail){
            return res.status(400).json({ message: "EmailId Already Exists!"})
        }
        const existingUsername = await User.findOne({$or:[{username}]});
        if(existingUsername){
            return res.status(400).json({ message: "Username Already Exists!"})
        }
        const profileImage = `https://api.dicebear.com/9.x/avataaars/svg?seed=${username}`;
        const user = new User({
            email,
            username,
            password,
            profileImage,
            createdAt: new Date()
        })
        await user.save();
        const token = generateToken(user._id)
        res.status(201).json({
            token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
                createdAt: user.createdAt,
            }
        })
    } catch (error) {
        console.log("Error In Register Route",error);
        res.status(500).json({message: "Internal Server Error!"})
    }
})

router.post("/login",async(req,res)=>{
    try {
        const {email,password} = req.body;
        if(!email||!password){
            return res.status(400).json({message: "All Fields are Required!"})
        }
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(400).json({message: "Invalid Credentials!"})
        }
        const isPasswordCorrect = await user.comparePassword(password)
        if(!isPasswordCorrect){
            return res.status(400).json({message: "Invalid Credentials!"})
        }
        const token = generateToken(user._id)
        res.status(201).json({
            token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
                createdAt: user.createdAt
            }
        })
    } catch (error) {
        console.log("Error In Login Route",error);
        res.status(500).json({message: "Internal Server Error!"})
    }
})

export default router;