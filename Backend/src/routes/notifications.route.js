import express from "express"; 
import { protect } from "../middlewares/auth.middleware.js";
import { sseConnect } from "../controllers/notifications.controller.js";

const notificationRouter = express.Router();



notificationRouter.get("/stream", protect, sseConnect);

export  default notificationRouter;