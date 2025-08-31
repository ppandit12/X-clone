import express,{Router}from "express";
import { getPosts,getPostById, getUserPosts,createPost,deletePost, likePost} from "../controller/post.controller.js";
import { upload } from "../middleware/upload.middleware.js";
import { protectedRoute } from "../middleware/auth.middleware.js";
const PostRouter = Router();


PostRouter.get("/", getPosts);
PostRouter.get("/:postId", getPostById);
PostRouter.get("/user/:userId", getUserPosts);


PostRouter.post("/",protectedRoute,upload.single("image"), createPost);
PostRouter.delete("/:postId", protectedRoute,deletePost);
 PostRouter.post("/:postId/likes", protectedRoute, likePost);

export default PostRouter;