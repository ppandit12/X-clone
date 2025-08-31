import express,{Router} from "express"
import { followUser, getCurrentUser, getUserProfile,syncUser,updateProfile} from "../controller/user.controller.js";
import {protectedRoute } from "../middleware/auth.middleware.js";


const router = Router();

router.get("/profile/:username",getUserProfile);

router.get("/me",protectedRoute,getCurrentUser);
router.post("/sync",protectedRoute,syncUser);
router.put("/profile",protectedRoute,updateProfile);
router.post("/follow/:targetId",protectedRoute,followUser);



export default router;