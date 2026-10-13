import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { getStreamToken, syncUser, updatePushTemplate } from "../controllers/chat.controller.js";
 
const Chatrouter = express.Router();
 
// Mounted at /api/chat in server.js
Chatrouter.get("/token", protect, getStreamToken); // GET /api/chat/token
Chatrouter.get("/sync-user/:id", protect, syncUser); 
Chatrouter.post("/push-template", protect, updatePushTemplate); // POST /api/chat/push-template
 
export default Chatrouter;
 