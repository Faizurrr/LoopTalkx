import express from "express";
import { sendFriendRequest , acceptFriendRequest , rejectFriendRequest , getFriendRequests } from "../controllers/friendrequest.controllers.js";   
 import { protect } from "../middlewares/auth.middleware.js"; 

const Friendrequestrouter = express.Router();

Friendrequestrouter.use(protect);    // Apply the protect middleware to all routes in this router

Friendrequestrouter.post("/send",  sendFriendRequest);
Friendrequestrouter.put("/accept/:requestId", acceptFriendRequest);
Friendrequestrouter.post("/reject/:requestId", rejectFriendRequest);
    Friendrequestrouter.get("/get", getFriendRequests);

export default Friendrequestrouter;