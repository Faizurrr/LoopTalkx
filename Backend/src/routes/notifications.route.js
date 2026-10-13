import express from "express"; 
import { protect } from "../middlewares/auth.middleware.js";
import { sseConnect } from "../controllers/notifications.controller.js";

const notificationRouter = express.Router();



notificationRouter.get("/stream", protect, sseConnect);  //  SSE connection to receive real-time notifications(friend requests)
  
export  default notificationRouter;