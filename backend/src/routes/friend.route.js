import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  blockFriend,
  removeFriend,
  responseRequest,
  sendRequest,
  listRequests,
  listBlocked,
  unblockFriend,
} from "../controllers/friend.controller.js";

const router = express.Router();

router.post("/send", protectRoute, sendRequest);
router.post("/response/:id", protectRoute, responseRequest);

router.post("/remove/:id", protectRoute, removeFriend);
router.post("/block/:id", protectRoute, blockFriend);
router.post("/unblock/:id", protectRoute, unblockFriend);

router.get("/listRequests", protectRoute, listRequests);
router.get("/listBlocked", protectRoute, listBlocked);

export default router;
