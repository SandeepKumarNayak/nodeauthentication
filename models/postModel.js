
import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    title:{
        type:String,
        required: [true, "Title is required"],
        trim: true,
    },
    description:{
        type:String,
        required: [true, "Description is required"],
        trim: true,
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required: [true, "User ID is required"],
        ref: "User" // Reference to the User model
    }
},{timestaps:true});
export default mongoose.model("Post", postSchema);

