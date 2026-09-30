import User from '../models/user.model.js'
import FriendRequest from '../models/user.model.js'


  // ─── Get all users ───
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // Exclude password from the response
    res.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
  
 

   // get me (current logged in user/profile)
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};




 // ─── Get recommended friends on this basis of native language and learning language and thier city..
export const getRecommendedFriends = async (req, res) => {
  try {
    const currentUserId = req.user._id || req.user.id;

    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
      return res.status(404).json({ success: false, message: 'Current user not found' });
    }

    const { NativeLanguage, LearningLanguage, city } = currentUser;

    // Find accepted requests in either direction (I sent it or I received it)
    const acceptedRequests = await FriendRequest.find({
      status: { $in: ['accepted', 'rejected'] } ,
      $or: [{ sender: currentUserId }, { receiver: currentUserId }],
    }).select('sender receiver');

    // Collect the other person's id from each accepted request
    const friendIds = acceptedRequests.map((r) =>
      r.sender.toString() === currentUserId.toString() ? r.receiver : r.sender
    );

    // Exclude myself and all accepted friends
    const excludeIds = [currentUserId, ...friendIds];

    // 1. Best match: language swap
    let recommendedFriends = await User.find({
      _id: { $nin: excludeIds },
      NativeLanguage: LearningLanguage,
      LearningLanguage: NativeLanguage,
    }).select('-password');

    // 2. Fallback: same language or same city
    if (recommendedFriends.length === 0) {
      recommendedFriends = await User.find({
        _id: { $nin: excludeIds },
        $or: [
          { NativeLanguage: LearningLanguage },
          { LearningLanguage: NativeLanguage },
          { city },
        ],
      })
        .limit(10)
        .select('-password');
    }

    return res.status(200).json({
      success: true,
      count: recommendedFriends.length,
      data: recommendedFriends,
    });
  } catch (error) {
    console.error('Error fetching recommended friends:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch recommendations',
      error: error.message,
    });
  }
};