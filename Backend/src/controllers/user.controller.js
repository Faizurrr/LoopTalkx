import User from '../models/user.model.js'



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

    // Fetch the current user's details
    const currentUser = await User.findById(currentUserId);

    if (!currentUser) {
      return res.status(404).json({ success: false, message: 'Current user not found' });
    }

    const { NativeLanguage, LearningLanguage, city } = currentUser;

    
    let recommendedFriends = await User.find({
      _id: { $ne: currentUserId }, // Exclude current user
      NativeLanguage: LearningLanguage, 
      LearningLanguage: NativeLanguage, 
    }).select('-password');

    // 2. Fallback: If no direct swap matches, find users learning the same language or in the same city
    if (recommendedFriends.length === 0) {
      recommendedFriends = await User.find({
        _id: { $ne: currentUserId },
        $or: [
          { NativeLanguage: LearningLanguage },
          { LearningLanguage: NativeLanguage },
          { city: city }
        ]
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
