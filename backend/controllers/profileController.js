import path from "path"; // For working with file paths
import fs from "fs"; // For file system operations
import User from "../models/userModel.js"; // User model

// Get profile of authenticated user
export const getProfile = async (req, res, next) => {
  try {
    const userId = req.user;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// Update profile (only provided non-image fields)
export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user;

    // Collect only provided fields
    const updateData = {};
    if (req.body.name !== undefined) updateData.name = req.body.name;
    if (req.body.email !== undefined) updateData.email = req.body.email;
    if (req.body.phone !== undefined) updateData.phone = req.body.phone;
    if (req.body.location !== undefined) updateData.location = req.body.location;
    if (req.body.gender !== undefined) updateData.gender = req.body.gender;
    if (req.body.dob !== undefined) updateData.dob = req.body.dob;
    if (req.body.bio !== undefined) updateData.bio = req.body.bio;
    if (req.body.profileImage !== undefined) updateData.profileImage = req.body.profileImage;
    if (req.body.coverImage !== undefined) updateData.coverImage = req.body.coverImage;

    // Update user
    const updated = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!updated) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// Delete old image from local storage if it exists
const deleteOldImageIfLocal = (imageUrl, req) => {
  if (
    imageUrl &&
    imageUrl.startsWith(`${req.protocol}://${req.get("host")}/uploads/`)
  ) {
    const oldImagePath = path.join(
      process.cwd(),
      "uploads",
      path.basename(imageUrl)
    );
    if (fs.existsSync(oldImagePath)) {
      fs.unlinkSync(oldImagePath);
    }
  }
};

// Upload and update user profile/cover images
export const uploadUserImages = async (req, res, next) => {
  try {
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Handle profile image upload
    if (req.files.profileImage && req.files.profileImage[0]) {
      const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.files.profileImage[0].filename}`;
      deleteOldImageIfLocal(user.profileImage, req);
      user.profileImage = fileUrl;
    }

    // Handle cover image upload
    if (req.files.coverImage && req.files.coverImage[0]) {
      const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.files.coverImage[0].filename}`;
      deleteOldImageIfLocal(user.coverImage, req);
      user.coverImage = fileUrl;
    }

    await user.save();

    // Fetch updated user info
    const updatedUser = await User.findById(req.user).select("-password");

    res.json({
      msg: "Images updated",
      profileImage: updatedUser.profileImage,
      coverImage: updatedUser.coverImage,
      user: updatedUser
    });
  } catch (err) {
    next(err);
  }
};
