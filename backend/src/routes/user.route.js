import express,{Router} from "express"
import { followUser, getCurrentUser, getUserProfile,syncUser,updateProfile} from "../controller/user.controller.js";
import {protectedRoute } from "../middleware/auth.middleware.js";


const userRouter = Router();

userRouter.get("/profile/:username",getUserProfile);

userRouter.get("/me",protectedRoute,getCurrentUser);
userRouter.post("/sync",protectedRoute,syncUser);
userRouter.put("/profile",protectedRoute,updateProfile);
userRouter.post("/follow/:targetId",protectedRoute,followUser);



export default userRouter;