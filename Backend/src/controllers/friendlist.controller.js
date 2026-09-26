import FriendRequest from "../models/friendrequest.model.js";
import User from '../models/user.model.js';

// Get all friends (accepted requests) of the logged-in user, excluding themselves
export const allfriends = async (req, res) => {
  try {
    const currentUserId = req.user._id || req.user.id;

    const acceptedRequests = await FriendRequest.find({
      status: "accepted",
      $or: [{ sender: currentUserId }, { receiver: currentUserId }],
    })
      .populate(
        "sender",
        "username email avatar bio NativeLanguage LearningLanguage city isOnline"
      )
      .populate(
        "receiver",
        "username email avatar bio NativeLanguage LearningLanguage city isOnline"
      );

    // The "friend" is whichever side of the request isn't the current user
    const friends = acceptedRequests.map((request) => {
      const isSender =
        request.sender._id.toString() === currentUserId.toString();
      return isSender ? request.receiver : request.sender;
    });

    return res.status(200).json({
      success: true,
      count: friends.length,
      data: friends,
    });
  } catch (error) {
    console.error("Error fetching friends:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching friends.",
      error: error.message,
    });
  }
};