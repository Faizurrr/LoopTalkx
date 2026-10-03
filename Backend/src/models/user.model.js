import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  { 
    fullname: {
       type: String,
        required: [true, 'Full name is required'],
        trim: true,
        minlength: 3,
        maxlength: 50,
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,        // creates a unique index
      lowercase: true,     // "FaizKhan" and "faizkhan" become the same handle
      trim: true,
      minlength: 3,
      maxlength: 30,
      match: /^[a-z0-9._]+$/, // letters, numbers, dot, underscore only
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    avatar: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
      maxlength: [200, 'Bio cannot exceed 200 characters'],
    },
    NativeLanguage: {
      type: String,
      default: '',
    },
    LearningLanguage: {
      type: String,
      default: '',
    },

    city:{
      type: String,
      default: '',
    },
    
    isOnline: {
      type: Boolean,
      default: false,
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// ─── Hash password before saving ──────────────────────────────────────────────
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ─── Instance method: compare passwords ───────────────────────────────────────
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
