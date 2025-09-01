import asyncHandler from "express-async-handler";
import { getAuth } from "@clerk/express";
import Post from "../models/post.model.js"
import User from "../models/user.model.js";
import cloudinary from "../config/cloudinary.config.js";
import Notification from "../models/notification.model.js";
import Comment from "../models/comment.model.js"


const getPosts = asyncHandler(async(req,res)=>{
  try {
    const posts = await Post.find()
    .sort({createdAt:-1})
    .populate("user", "username firstName lastName profileImage")
    .populate({
      path: "comments",
      populate: {
        path: "user",
        select: "username firstName lastName profileImage"
      }
    })
    res.status(200).json({success:true,posts});
  } catch (error) {
    console.log("Error fetching posts", error);
    res.status(500).json({success:false,message:error.message});
  }
})

const getPostById = asyncHandler(async(req,res)=>{
    try {
      const { postId } = req.params;
      if(!postId) {
        return res.status(400).json({ success: false, message: "Post ID is required" });
      }
      const post = await Post.findById(postId)
      .populate("user", "username firstName lastName profileImage")
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "username firstName lastName profileImage"
        }
      });
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }
    res.status(200).json({ success: true, post });
  } catch (error) {
    console.log("Error fetching post", error);
    res.status(500).json({ success: false, message: error.message });
  }
})



const getUserPosts = asyncHandler(async(req,res)=>{
    try {
        const {username} = req.params;
        if(!username) {
            return res.status(400).json({ success: false, message: "Username is required" });
        }
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const posts = await Post.find({ user: user._id })
        .sort({ createdAt: -1 })
        .populate("user", "username firstName lastName profileImage")
        .populate({
            path: "comments",
            populate: {
                path: "user",
                select: "username firstName lastName profileImage"
            }
        });
        res.status(200).json({ success: true, posts });
    } catch (error) {
        console.log("Error fetching user posts", error);
        res.status(500).json({ success: false, message: error.message });
    }
})


const createPost = asyncHandler(async (req, res) => {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const { content } = req.body;
        const imageFile = req.file;

        if (!(content && content.trim()) && !imageFile) {
            return res.status(400).json({ error: "Post must contain either text or image" });
        }

        const user = await User.findOne({ clerkId: userId });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        let imageUrl = "";
        if (imageFile) {
            try {
                // convert buffer to base64 for cloudinary
                const base64Image = `data:${imageFile.mimetype};base64,${imageFile.buffer.toString(
                    "base64"
                )}`;

                const uploadResponse = await cloudinary.uploader.upload(base64Image, {
                    folder: "social_media_posts",
                    resource_type: "image",
                    transformation: [
                        { width: 800, height: 600, crop: "limit" },
                        { quality: "auto" },
                        { format: "auto" },
                    ],
                });
                imageUrl = uploadResponse.secure_url;
            } catch (uploadError) {
                console.error("Cloudinary upload error:", uploadError);
                return res.status(502).json({ success: false, message: "Failed to upload image" });
            }
        }

        const post = await Post.create({
            user: user._id,
            content: content || "",
            image: imageUrl,
        });

        res.status(201).json({ post, message: "Post created successfully" });

    } catch (error) {
        console.log("Error while creating post", error);
        res.status(500).json({ success: false, message: error.message });
    }
});



const likePost = asyncHandler(async(req,res)=>{
    try {
        const {userId} = getAuth(req);
        const {postId} = req.params;
        const user = await User.findOne({clerkId:userId});
        const post = await Post.findById(postId);
        if(!user || !post) {
            return res.status(404).json({ success: false, message: "User or Post not found" });
        }
        const isliked = post.likes.includes(user._id);

        if(isliked){
            //unlike
            await Post.findByIdAndUpdate(postId,{
                $pull:{likes:user._id}
            })
        }else{
            await Post.findByIdAndUpdate(postId,{
                $push:{likes:user._id}
            })  
        if(post.user.toString() != user._id.toString()){
            await Notification.create({
                from: user._id,
                to:post.user,
                type:"like",
                post:postId
            })
        }
     }
    res.status(200).json({
    message: isliked ? "Post unliked successfully" : "Post liked successfully",
    });
    } catch (error) {
     console.log("Error while liking post", error);
     res.status(500).json({ success: false, message: error.message });
    }
})



const deletePost = asyncHandler(async(req,res)=>{
    try {
        const {userId} = getAuth(req);
        const {postId} = req.params;
        const user = await User.findOne({clerkId:userId});
        const post = await Post.findById(postId);
        if(!user || !post) {
            return res.status(404).json({ success: false, message: "User or Post not found" });
        }
        if(post.user.toString() !== user._id.toString()){
            res.status(403).json({ success: false, message: "You can only delete your own posts" });
        }
        await Comment.deleteMany({ post: postId });
        // delete the post
       await Post.findByIdAndDelete(postId);
      res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
    console.log("Error while deleting post", error);
    res.status(500).json({ success: false, message: error.message });   
    }
})

export {getPosts,getPostById,getUserPosts,createPost,likePost,deletePost};