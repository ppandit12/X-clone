import asyncHandler from "express-async-handler";
import { getAuth } from "@clerk/express";
import Comment from "../models/comment.model.js";
import User from "../models/user.model.js"
import Post from "../models/post.model.js"
import Notification from "../models/notification.model.js"

const getComments = asyncHandler(async (req, res) => {
   try {
    const {postId} = req.params;
    const comment =  await Comment.findOne({post: postId })
     .sort({createdAt:-1})
     .populate("user",firstName,lastName,username,profilePicture);
     if(!user) return res.status(400).json({message:"post does not exist"})
     return res.status(200).json({comment,message:"The comment is"})  
   }catch(error) {
    console.log("Error while getting comments",error);
    return res.status(500).json({message:"error while getting user"});
   }  

})


const createComment = asyncHandler(async(req,res)=>{
   const {userId} = getAuth(req);
   const {postId} = req.params;
   const {content} = req.body;

   if(content || content.trim()=== ""){
   return res.status(400).json({ error: "Comment content is required" });
   }
  const user = await User.findOne({clerkId:userId});
  const post  = await Post.findById(postId);
  if (!user || !post) return res.status(404).json({ error: "User or post not found" });

  const comment = await Comment.create({
    user: user._id,
    post: postId,
    content,
  });

  // link the comment to the post
  await Post.findByIdAndUpdate(postId, {
    $push: { comments: comment._id },
  });

  if(post.user._id.toString() !== user._id.toString()){
   await Notification.create({
      from: user._id,
      to: post.user,
      type: "comment",
      post: postId,
      comment: comment._id,
   })
  }
  res.status(201).json({comment});
})




const deleteComment = asyncHandler(async(req,res)=>{
   const {userId} = getAuth(req);
   const {commentId} = req.params;

   const user = await User.findOne({clerkId:userId});
   const comment  = await Comment.findById({commentId});
   
   if(!user || !comment){
      return res.status(404).json({error: "User or comment not found"});
   }
   if(comment.user._id.toString() !== user._id.toString()){
      return res.status(403).json({error:"You can only delete you own comment"});
   }
   
   await Post.findByIdAndDelete(comment.post,{
      $pull:{
         comments : commentId
      },
   });

   await Comment.findByIdAndDelete(commentId);
   res.status(200).json({message:"Comment deleted successfully"});

})


export {getComments,createComment,deleteComment}

