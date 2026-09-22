import User from '../models/user.model.js';

 export const createprofile = async (req, res) => {
  try {
 
    const { bio, NativeLanguage, LearningLanguage,  city , avatar } = req.body;

    // 2. Get authenticated user ID (from your auth middleware, e.g., JWT verify)
    const userId = req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized. User ID not found.',
      });
    }

    // 3. Update the existing user document in MongoDB
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...(bio && { bio }),
        ...(NativeLanguage && { NativeLanguage }),
        ...(LearningLanguage && { LearningLanguage }),
        ...(city && { city }),
        ...(avatar && { avatar }),
      },
      { new: true, runValidators: true }
    ).select('-password'); // Omit password hash from response

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // 4. Return updated user object
    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while updating profile',
      error: error.message,
    });
  }
};

export default createprofile;