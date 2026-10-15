import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true,
      maxlength: [60, 'Name cannot exceed 60 characters']
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address'
      ]
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters']
    },
    handle: {
      type: String,
      trim: true,
      default: function() {
        return `@${this.name.toLowerCase().replace(/\s+/g, '_')}`;
      }
    },
    role: {
      type: String,
      default: 'Student'
    },
    year: {
      type: String,
      default: 'University Student'
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
    },
    initials: {
      type: String,
      default: function() {
        if (!this.name) return 'PB';
        const parts = this.name.trim().split(/\s+/);
        if (parts.length >= 2) {
          return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }
        return parts[0].substring(0, 2).toUpperCase();
      }
    },
    bio: {
      type: String,
      default: '',
      maxlength: [300, 'Bio cannot exceed 300 characters']
    },
    goals: {
      type: [String],
      default: []
    },
    primaryCategory: {
      type: String,
      enum: ['Study', 'Hackathon', 'Career', 'Projects'],
      default: 'Study'
    },
    preferredAvailability: {
      type: String,
      default: 'Today, 7 PM'
    },
    availabilityKey: {
      type: String,
      enum: ['today_evening', 'this_weekend', 'weekday_evenings', 'flexible'],
      default: 'flexible'
    },
    commitment: {
      type: String,
      enum: ['Focused', 'Regular', 'Casual'],
      default: 'Regular'
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function(doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
      }
    }
  }
);

// Hash password before saving
UserSchema.pre('save', async function() {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model('User', UserSchema);
