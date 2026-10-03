import mongoose from "mongoose";
import { generateStreamToken, upsertStreamUser } from "../lib/stream.js";
import User from "../models/user.model.js";

// Works whichever field names your User model uses
const toStreamUser = (user) => ({
  id: user._id.toString(),
  name: user.fullname || user.fullName || user.username || "User",
  image: user.avatar || user.profilePic || "",
});

// GET /api/chat/token
// Upserts the logged-in user to Stream and returns their token
export async function getStreamToken(req, res) {
  try {
    const me = req.user;
    const plain = typeof me.toObject === "function" ? me.toObject() : me;
    const streamUser = toStreamUser({ ...plain, _id: plain._id || plain.id });

    await upsertStreamUser(streamUser);
    const token = generateStreamToken(streamUser.id);

    return res.status(200).json({ success: true, token, userId: streamUser.id });
  } catch (error) {
    console.error("Error in getStreamToken:", error);
    return res
      .status(500)
      .json({ success: false, message: error.message || "Internal Server Error" });
  }
}

// GET /api/chat/sync-user/:id
// Makes sure the other person exists in Stream before a channel is created
export async function syncUser(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid user id" });
    }

    const targetUser = await User.findById(id);
    if (!targetUser) {
      console.error("syncUser: no user in MongoDB with id", id);
      return res.status(404).json({ success: false, message: "User not found" });
    }

    await upsertStreamUser(toStreamUser(targetUser));

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error in syncUser:", error);
    return res
      .status(500)
      .json({ success: false, message: error.message || "Internal Server Error" });
  }
}