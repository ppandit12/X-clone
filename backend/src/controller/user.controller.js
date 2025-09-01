import asyncHandler from "express-async-handler";
import { clerkClient, getAuth } from "@clerk/express";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";

const getUserProfile = asyncHandler(async(req,res)=>{
   try {
       const { username } = req.params;
       if (!username) return res.status(400).json({ message: "Username is required" });
       
       const user = await User.findOne({ username });
       if (!user) return res.status(404).json({ message: "User not found" });
       res.status(200).json({ message: user });
   } catch (error) {
       console.error("Error fetching user profile:", error);
       res.status(500).json({ message: "Server error" });
   }
});


const updateProfile = asyncHandler(async(req,res)=>{
   try {
     const {userId} = getAuth(req);
     const user = await User.findOneAndUpdate({ clerkId: userId }, req.body, { new: true });
     if (!user) return res.status(404).json({ message: "User not found" });
     res.status(200).json({ message: user });
   } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Server error" });
   }
});

const syncUser = asyncHandler(async(req,res)=>{
 try {
    // create the user if email is not their in database
    // get the user from clerk 
    const {userId} = getAuth(req);
    const existingUser = await User.findOne({ clerkId: userId });
    if (existingUser) return res.status(404).json({ message: "User already exists" });
   const clerkUser = await clerkClient.users.getUser(userId);
   const userData = {
    clerkId:userId,
    email:clerkUser.emailAddresses[0].emailAddress,
    username:clerkUser.emailAddresses[0].emailAddress.split("@")[0] + "_" + Date.now(),
    firstname:clerkUser.firstName || "",
    lastname:clerkUser.lastName || "",
    profilePicture:clerkUser.imageUrl || "",
   };
   const user = await User.create(userData);
   res.status(201).json({ user,message: "User created successfully" });
 } catch (error) {
    console.log("Error syncing user:", error);
    res.status(500).json({ message: "Server error" });
 }
});


const getCurrentUser = asyncHandler(async(req,res)=>{
  try {
    const {userId} = getAuth(req);
    const user = await User.findOne({ clerkId: userId });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ user });
  } catch (error) {
    console.log("Error fetching current user:", error);
    res.status(500).json({ message: "Server error" });
  }
})


const followUser = asyncHandler(async(req,res)=>{
   try {
       const { userId } = getAuth(req);
       const { targetId } = req.params;

       if (!targetId || !currentUser) return res.status(400).json({ message: "Target and user ID is required" });

       const currentUser = await User.findOne({ clerkId: userId });
       const targetUser = await User.findOne({ clerkId: targetId });

      if (!currentUser || !targetUser) return res.status(404).json({ error: "User not found" });

      if(currentUser._id.toString() === targetUser._id.toString()){
        return res.status(400).json({ message: "You cannot follow yourself" });
      }

      const isFollowing = currentUser.following.includes(targetId);
      if (isFollowing){
      await User.findByIdAndUpdate(currentUser._id, {
      $pull: { following: targetId },
    });
    await User.findByIdAndUpdate(targetId, {
      $pull: { followers: currentUser._id },
    });
    } else {
        await User.findByIdAndUpdate(currentUser._id, {
      $push: { following: targetId },
    });
    await User.findByIdAndUpdate(targetId, {
      $push: { followers: currentUser._id },
    },{session});
      }

    await Notification.create([{
        from:currentUser._id,
        to:targetUser._id,
        type: "FOLLOW",
    }],{session});

    await session.commitTransaction();
   }catch(error){
    await session.abortTransaction();
    throw error;
   }finally{
    session.endSession();
   }
  
})



export { getUserProfile,updateProfile,syncUser,getCurrentUser,followUser};