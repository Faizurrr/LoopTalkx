import express from "express";
import {protect} from "../middlewares/auth.middleware.js";
import {allfriends} from "../controllers/friendlist.controller.js";
const Friendrouter = express.Router();

Friendrouter.get("/friends" , protect , allfriends );
export default Friendrouter;