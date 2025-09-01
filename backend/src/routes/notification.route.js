import express,{Router} from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import { getNotifications,deleteNotifications } from "../controller/notification.controller.js";


const notificationRouter = Router();


notificationRouter.get("/",protectedRoute,getNotifications);
notificationRouter.post("/:notificationId",protectedRoute,deleteNotifications);





export default notificationRouter;