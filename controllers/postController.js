import { postSchemaValidator } from "../middleware/validator.js";
import postModel from "../models/postModel.js";



export const getPosts = async(req, res) =>{
    const {page} = req.query;getPosts
    const postsPerPage = 10;
    try{
          let pageNo = 0;
          if(page <= 1|| page === undefined){
            pageNo = 0;
          }else {
            pageNo = page - 1;
          }
          const results = await postModel.find().sort({createdAt:-1}).skip(pageNo * postsPerPage).limit(postsPerPage).populate({
            path:'userId',
            select:'email'
          });

          res.status(200).json({
            success: true,
            message: "Posts fetched successfully",
            posts: results,
          })
    } catch(err){
        console.error("Error in getPosts:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export const createPost = async(req, res) =>{
    const {userId} = req.user;
    const {title, description} = req.body;
    try{
        const {error, value} = postSchemaValidator.validate({title, description, userId});
        if(error){
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }
        const newPost = new postModel({
            title,
            description,
            userId
        });
        const savedPost = await newPost.save();
        return res.status(201).json({
            success: true,
            message: "Post created successfully",
            post: savedPost
        });
    } catch(err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}


export const getPostById = async(req, res) =>{
    const {id} = req.query;
    try{
        if(!id) {
            return res.status(400).json({
                success: false,
                message: "Post ID is required"
            });
        }
        const post = await postModel.findById(id).populate({
            path:'userId',
            select:'email'
        })
        if(!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Post fetched successfully",
            data:post
        });
    }catch(err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export const deletePost = async(req, res) =>{
    const {id} = req.query;
    try{
        if(!id) {
            return res.status(400).json({
                success: false,
                message: "Post ID is required"
            });
        }
        const post = await postModel.findByIdAndDelete(id);
        if(!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Post deleted successfully"
        }); 
    }catch(err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error" + err.message
        });
    }
}

export const updatePost = async(req, res) =>{
    const {id} = req.query;
    try{
        if(!id) {
            return res.status(400).json({
                success: false,
                message: "Post ID is required"
            });
        }
        const {title, description} = req.body;
        const {error, value} = postSchemaValidator.validate({title, description, userId:req.user.userId});
        if(error){
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }
        const post = await postModel.findByIdAndUpdate(id, {title, description}, {new: true});
        if(!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Post updated successfully",
            post
        });
    }catch(err){
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export const getPostsByUserId = async(req, res) =>{
    const {userId} = req.user;
    try{
        if(!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }
        const posts = await postModel.find({userId}).populate({
            path:'userId',
            select:'email'  
        });
        if(!posts || posts.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No posts found for this user"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Posts fetched successfully",
            posts
        });
    }catch(err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        }); 
    }
}