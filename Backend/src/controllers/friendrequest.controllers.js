import FriendRequest from "../models/friendrequest.model.js";
import User from '../models/user.model.js';

export const sendFriendRequest = async (req, res) => {
  try {
    const senderId = req.user._id || req.user.id; // Logged-in user sending request
    const { receiverId } = req.body;               // ID of recipient from body or params

    // Step 1: Prevent sending a request to oneself
    if (senderId.toString() === receiverId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot send a friend request to yourself.',
      });
    }

    // Step 2: Verify recipient exists in database
    const receiverExists = await User.findById(receiverId);
    if (!receiverExists) {
      return res.status(404).json({
        success: false,
        message: 'User to whom you are sending the request does not exist.',
      });
    }

    // Step 3: Check if a request already exists between these users
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    });

    if (existingRequest) {
      if (existingRequest.status === 'pending') {
        return res.status(400).json({
          success: false,
          message: 'A friend request is already pending between you two.',
        });
      }
      if (existingRequest.status === 'accepted') {
        return res.status(400).json({
          success: false,
          message: 'You are already friends with this user.',
        });
      }
    }

    // Step 4: Create new pending request
    const newRequest = await FriendRequest.create({
      sender: senderId,
      receiver: receiverId,
      status: 'pending',
    });

    return res.status(201).json({
      success: true,
      message: 'Friend request sent successfully!',
      data: newRequest,
    });
  } catch (error) {
    console.error('Error sending friend request:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while sending friend request.',
      error: error.message,
    });
  }
};
 

// Accept Friend Request
export const acceptFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params; // Get the request ID from URL parameters
    const currentUserId = req.user._id || req.user.id; // Currently logged-in user

    // Step 1: Find the friend request by ID
    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({
        success: false,
        message: 'Friend request not found.',
      });
    }

    // Step 2: Ensure only the recipient can accept the request
    if (friendRequest.receiver.toString() !== currentUserId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized. You can only accept requests sent to you.',
      });
    }

    // Step 3: Check if the request is already processed
    if (friendRequest.status === 'accepted') {
      return res.status(400).json({
        success: false,
        message: 'Friend request has already been accepted.',
      });
    }

    // Step 4: Update request status to "accepted"
    friendRequest.status = 'accepted';
    await friendRequest.save();

    return res.status(200).json({
      success: true,
      message: 'Friend request accepted successfully!',
      data: friendRequest,
    });
  } catch (error) {
    console.error('Error accepting friend request:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while accepting friend request.',
      error: error.message,
    });
  }
};


 // Reject Friend Request
export const rejectFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params; // Get the request ID from URL parameters
    const currentUserId = req.user._id || req.user.id; // Currently logged-in user

    // Step 1: Find the friend request in the database
    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({
        success: false,
        message: 'Friend request not found.',
      });
    }

    // Step 2: Ensure only the intended receiver can reject the request
    if (friendRequest.receiver.toString() !== currentUserId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized. You can only reject friend requests sent to you.',
      });
    }

    // Step 3: Check if the request is already processed
    if (friendRequest.status === 'rejected') {
      return res.status(400).json({
        success: false,
        message: 'Friend request has already been rejected.',
      });
    }

    if (friendRequest.status === 'accepted') {
      return res.status(400).json({
        success: false,
        message: 'Cannot reject an already accepted request. Use unfriend instead.',
      });
    }

    // Step 4: Update request status to "rejected"
    friendRequest.status = 'rejected';
    await friendRequest.save();

    return res.status(200).json({
      success: true,
      message: 'Friend request rejected successfully.',
      data: friendRequest,
    });
  } catch (error) {
    console.error('Error rejecting friend request:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while rejecting friend request.',
      error: error.message,
    });
  }
};




// Get all pending friend requests for the logged-in user
export const getFriendRequests = async (req, res) => {
  try {
    const currentUserId = req.user._id || req.user.id; // Logged-in user ID from protect middleware

    // Step 1: Find all pending requests sent to the logged-in user
    const friendRequests = await FriendRequest.find({
      receiver: currentUserId,
      status: 'pending',
    }).populate(
      'sender',
      'username email avatar bio NativeLanguage LearningLanguage city isOnline'
    );

    // Step 2: Return response
    return res.status(200).json({
      success: true,
      count: friendRequests.length,
      data: friendRequests,
    });
  } catch (error) {
    console.error('Error fetching friend requests:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching friend requests.',
      error: error.message,
    });
  }
};     
