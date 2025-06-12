import { transPort } from "../middleware/sendMail.js";
import { acceptCodeSchemaValidation, changePasswordSchemaValidator, forgotPasswordSchemaValidator, signUpSchemaValidation } from "../middleware/validator.js";
import User from "../models/userModel.js";
import { doHash, doHashValidation, hmacProcess } from "../utils/hashing.js";
import jwt from "jsonwebtoken";


export const signUp = async (req, res) => {
    const {email, password} = req.body;
    try{
        const {error, value }= signUpSchemaValidation.validate({email, password});
        if(error) {
            return res.status(401).json({success:false, message:error.details[0].message});
        }
        // Check if user already exists
        const existingUser = await User.findOne({email});
        if(existingUser) {
            return res.status(409).json({success:false, message:"User already exists"});
        }

        // Create new user
        const hashedPassword = await doHash(password, 12);
        const newUser = new User({
            email,
            password: hashedPassword
        })
        const result = await newUser.save();
        res.status(201).json({
            success:true,
            message:"User created successfully",
            user: {
                email: result.email,
                verified: result.verified
            }
        });
    }catch(err) {
        return res.status(500).json({message: "Internal Server Error"});
        
    }
}



export const signIn = async (req, res) =>{
    const {email, password} = req.body;
    try {
        // Validate input
        const {error, value} = signUpSchemaValidation.validate({email, password});
        if(error) {
            return res.status(401).json({success:false, message:error.details[0].message});
        }

        // Check if user exists
        const user = await User.findOne({email}).select("+password +verified");
        if(!user) {
            return res.status(404).json({success:false, message:"User not found"});
        }

        const result = await doHashValidation(password, user.password);
        if(!result){
            return res.status(401).json({success:false, message:"Invalid credentials"});
        }
        const token = jwt.sign({
            userId:user._id,
            email:user.email,
            verified:user.verified
        },process.env.TOKEN_SECRET,{expiresIn:'5h'})
        res.cookie('Authorization', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 5 * 60 * 60 * 1000 // 5 hours in milliseconds
        }).json({
            success:true,
            message:"User signed in successfully",
            token:token
        })

    } catch (err) {
        console.log("Error in signIn:", err);
        return res.status(500).json({success:false, message: "Internal Server Error"});
    }   
}


export const signOut =async (req, res) =>{
    res.clearCookie('Authorization').status(200).json({
        success:true,
        message:"User signed out successfully"
    });
}


export const sendVerificationCode = async (req, res) =>{
    const {email} = req.body;
    try{
        const user = await User.findOne({email}).select("+verificationCode +verificationCodeValidation +verified");
        if(!user) {
            return res.status(404).json({
                success:false,
                message:"user not found"
            })
        }
        if(user.verified){
            return res.status(400).json({
                success:false,
                message:"User already verified"
            })
        }
        const codeValue = Math.floor(100000 + Math.random()* 900000).toString();
        
        let info = await transPort.sendMail({
            from: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
            to: email,
            subject: "Verification Code",
            html: `<h1>Your verification code is ${codeValue}</h1>`,
        })
        if(info.accepted[0] === user.email){
            const hashedCodeValue = hmacProcess(codeValue, process.env.HMAC_CODE_SECRET)
            user.verificationCode = hashedCodeValue;
            user.verificationCodeValidation = Date.now() + 10 * 60 * 1000; // 10 minutes validity
            await user.save();
            return res.status(200).json({
                success:true,
                message:"Verification code sent successfully"
            })
        }
        return res.status(400).json(
            {
                success:false,
                message:"Failed to send verification code"
            }
        )
    }catch(err) {
        return res.status(500).json({
            success: false,
            message: `Internal Server Error: ${err.message}`
        })
    }
}


export const verifyVerificationCode = async (req, res) =>{
    const {email, code} = req.body;
    try{
        const {error, value} = acceptCodeSchemaValidation.validate({email, code});
        if(error){
            return res.status(401).json({
                success:false,
                message:error.details[0].message
            })
        } 
        const user = await User.findOne({email}).select("+verificationCode +verificationCodeValidation +verified");
        if(!user) {
            return res.status(404).json({
                success:false,
                message:"user not found"
            })
        }
        if(user.verified) {
            return res.status(400).json({
                success:false,
                message:"User already verified"
            })
        }
        if(user.verificationCodeValidation < Date.now()) {
            return res.status(400).json({
                success:false,
                message:"Verification code expired"
            })
        }
        const hashedCodeValue = hmacProcess(code.toString(), process.env.HMAC_CODE_SECRET);
        if(user.verificationCode !== hashedCodeValue) {
            return res.status(400).json({
                success:false,
                message:"Invalid verification code"
            })
        }
        user.verified = true;
        user.verificationCode = undefined; // Clear verification code
        user.verificationCodeValidation = undefined; // Clear validation time
        await user.save();
        return res.status(200).json({
            success:true,
            message:"Verification code verified successfully"
        })

    } catch(err) {
        return res.status(500).json({
            success:false,
            message:'Internal Server Error: ' + err.message
        })
    }
}


export const changePassword = async(req, res)=>{
    const {userId, verified} = req.user;
    const {oldPassword, newPassword} = req.body;
    try{
        const {error, value} = changePasswordSchemaValidator.validate({oldPassword, newPassword});
        if(error) {
            return res.status(401).json({
                success:false,
                message:error.details[0].message
            })
        }
        if(!verified) {
            return res.status(403).json({
                success:false,
                message:"User not verified"
            })
        }
        const user = await User.findById(userId).select("+password");
        if(!user) {
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }
        const isPasswordValid = await doHashValidation(oldPassword, user.password);
        if(!isPasswordValid) {
            return res.status(401).json({
                success:false,
                message:"Invalid old password"
            })
        }
        const hashedNewPassword = await doHash(newPassword, 12);
        user.password = hashedNewPassword;
        await user.save();
        return res.status(200).json({
            success:true,
            message:"Password changed successfully"
        })
        
    }catch(err) {
        return res.status(500).json({message: "Internal Server Error"});
    }
}



export const sendForgotPasswordCode = async(req, res) =>{
    const {email} = req.body;
    try{
        const user = await User.findOne({email}).select("+forgotPasswordCode + fofgotPasswordCodeValidation +verified");
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }
        if(!user.verified){
            return res.status(403).json({
                success:false,
                message:"User not verified"
            })
        }
        const codeValue = Math.floor(100000 + Math.random() * 900000).toString();
        let info = await transPort.sendMail({
            from:process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
            to:email,
            subject:"Forgot Password Code",
            html:`<h1>Your forgot password code is ${codeValue}</h1>`
        })
        if(info.accepted[0] === email) {
            const hashedCodeValue = hmacProcess(codeValue, process.env.HMAC_CODE_SECRET);
            user.forgotPasswordCode = hashedCodeValue;
            user.forgotPasswordCodeValidation = Date.now() + 10 * 60 * 1000; // 10 minutes validity
            await user.save();
            return res.status(200).json({
                success:true,
                message:"Forgot password code sent successfully"
            })
        }
        console.log("Failed to send forgot password code:", info);
        return res.status(400).json({
            success:false,
            message:"Failed to send forgot password code"
        })
    }catch(err) {
        return res.status(500).json({
            success: false,
            message: `Internal Server Error: ${err.message}`
        })
    }
}

export const forgotPasswordCodeVerification = async(req, res) =>{
    const {email, code, newPassword} = req.body;
    try{
        const {error, value} = forgotPasswordSchemaValidator.validate({email, newPassword, code});
        if(error){
            return res.status(401).json({
                success:false,
                message:error.details[0].message
            })
        }
        const user = await User.findOne({email}).select("+forgotPasswordCode +forgotPasswordCodeValidation +verified +password");
        if(!user) {
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }
        if(!user.verified) {
            return res.status(403).json({
                success:false,
                message:"User not verified"
            })
        }
        if(user.forgotPasswordCodeValidation < Date.now()) {
            return res.status(400).json({
                success:false,
                message:"Forgot password code expired"
            })
        }
        const hashedCodeValue = hmacProcess(code.toString(), process.env.HMAC_CODE_SECRET);
        if(user.forgotPasswordCode !== hashedCodeValue) {
            return res.status(400).json({
                success:false,
                message:"Invalid forgot password code"
            })
        }
        const hashedNewPassword = await doHash(newPassword, 12);
        user.password = hashedNewPassword;
        user.forgotPasswordCode = undefined; // Clear forgot password code
        user.forgotPasswordCodeValidation = undefined; // Clear validation time
        await user.save();
        return res.status(200).json(
            {
                success:true,
                message:"Password changed successfully"
            }
        )
        
    } catch(err) {
        return res.status(500).json({
            success:false,
            message:'Internal Server Error: ' + err.message
        })
    }
}