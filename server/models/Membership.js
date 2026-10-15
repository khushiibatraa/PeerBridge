import mongoose from 'mongoose';

const MembershipSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required for membership']
    },
    mission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Mission',
      required: [true, 'Mission is required for membership']
    },
    role: {
      type: String,
      enum: ['Host', 'Member'],
      default: 'Member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
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
        return ret;
      }
    }
  }
);

// Compound unique index prevents duplicate joins at the database layer
MembershipSchema.index({ user: 1, mission: 1 }, { unique: true });
MembershipSchema.index({ mission: 1 });
MembershipSchema.index({ user: 1 });

export const Membership = mongoose.model('Membership', MembershipSchema);
