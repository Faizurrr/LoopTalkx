import express from "express";
 import { correctMessage} from "../controllers/ai.controller.js";
  import { protect } from "../middlewares/auth.middleware.js";
const airouter = express.Router();
airouter.post("/correct" , protect, correctMessage);
export default airouter;