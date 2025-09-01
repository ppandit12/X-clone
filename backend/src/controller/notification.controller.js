import { getAuth } from "@clerk/express";
import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";

const getNotifications = asyncHandler(async(req,res)=>{
  try {
    const {userId} = getAuth(req);
    const user = await User.findOne({clerkId:userId});
     if (!user) return res.status(404).json({ error: "User not found" });
     const notifications = await Notification.find({ to: user._id })
    .sort({ createdAt: -1 })
    .populate("from", "username firstName lastName profilePicture")
    .populate("post", "content image")
    .populate("comment", "content");
     res.status(200).json({ notifications });
  } catch (error) {
    console.log("Error while getting Notifications",error);
    res.send(400).json({error,message:"error while getting notifications"})
  }
});

const deleteNotifications = asyncHandler(async(req,res)=>{
    try {
        const { userId } = getAuth(req);
      const { notificationId } = req.params;
    
      const user = await User.findOne({ clerkId: userId });
      if (!user) return res.status(404).json({ error: "User not found" });
    
      const notification = await Notification.findOneAndDelete({
        _id: notificationId,
        to: user._id,
      });
    
      if (!notification) return res.status(404).json({ error: "Notification not found" });
    
      res.status(200).json({ message: "Notification deleted successfully" });
    } catch (error) {
        console.log("Error while deleting notifications",error);
        res.status(500).json({ message: "Error while deleting Notification" });
    }
})





export {getNotifications,deleteNotifications}


