import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { getStreamToken, syncUser } from "../controllers/chat.controller.js";
 
const Chatrouter = express.Router();
 
// Mounted at /api/chat in server.js
Chatrouter.get("/token", protect, getStreamToken); // GET /api/chat/token
Chatrouter.get("/sync-user/:id", protect, syncUser); // GET /api/chat/sync-user/:id
 
export default Chatrouter;
 