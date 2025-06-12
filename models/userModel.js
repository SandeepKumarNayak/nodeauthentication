import mongoose from "mongoose";
const userSchema = mongoose.Schema({
    email:{
        type:String,
        required:[true, "Email is required"],
        unique:[true, "Email already exists"],
        match:[/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"],
        trim:true,
        minLength:[5, "Email must be at least 5 characters long"],
        lowercase:true
    },
    password:{
        type:String,
        required:[true, "Password is required"],
        minLength:[6, "Password must be at least 6 characters long"],
        select:false, // Do not return password in queries
        trim:true,
         
    },
    verified:{
        type:Boolean,
        default:false,
        select:false // Do not return verified status in queries
    },
    verificationCode:{
        type:String,
        select:false, // Do not return verification code in queries
    },
    verificationCodeValidation:{
        type:Number,
        select:false
    },
    forgotPasswordCode:{
        type:String,
        select:false
    },
    forgotPasswordCodeValidation:{
        type:Number,
        select:false
    },
},{timestamps:true});

export default mongoose.model("User", userSchema);