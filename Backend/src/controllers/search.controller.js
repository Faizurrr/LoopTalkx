// import User from "../models/user.model.js";

// export const searchuser = async (req, res) => {
//   try {
//     const { query } = req.query;

//     const users = await User.find({
//       $or: [
//         { fullname: { $regex: query, $options: 'i' } },
//         { username: { $regex: query, $options: 'i' } },
//         { email: { $regex: query, $options: 'i' } }
//       ]
//     }).select('-password');

//     res.status(200).json({
//       success: true,
//       data: users
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal Server Error'
//     });
//   }
// };


 // there was a bug in the previous code where it was searching for email as well, which is not needed. The new code only searches for fullname and username, and also limits the results to 10 users.

import User from "../models/user.model.js";

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const searchuser = async (req, res) => {
  
  try {
    const query = String(req.query.query || "").trim();

    if (!query) {
      return res.status(200).json({ success: true, data: [] });
    }

    if (query.length > 30) {
      return res
        .status(400)
        .json({ success: false, message: "Search term too long" });
    }

    const regex = new RegExp(escapeRegex(query), "i");

    const users = await User.find({
      _id: { $ne: req.user?._id }, // optional: hide the logged-in user
      $or: [{ fullname: regex }, { username: regex }],
    })
      .select("fullname username city avatar")
      .limit(10)
      .lean();

    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error("Search user error:", error);
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};