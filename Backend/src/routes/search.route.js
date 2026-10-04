import express from "express";
import { searchuser } from "../controllers/search.controller.js";
import {protect} from '../middlewares/auth.middleware.js';
const searchrouter = express.Router();

searchrouter.get("/search" , protect , searchuser);

export default searchrouter;
