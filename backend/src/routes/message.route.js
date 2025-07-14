import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getData,
  getMessages,
  getUnreadMessagesCount,
  getUsersForSidebar,
  sendMessage,
} from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/data", protectRoute, getData);
router.get("/unread", protectRoute, getUnreadMessagesCount);
router.get("/:id", protectRoute, getMessages);

router.post("/send/:id", protectRoute, sendMessage);
export default router;
