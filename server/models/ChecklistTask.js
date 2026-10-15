import mongoose from 'mongoose';

const ChecklistTaskSchema = new mongoose.Schema(
  {
    mission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Mission',
      required: [true, 'Mission reference is required for checklist task']
    },
    text: {
      type: String,
      required: [true, 'Task description text is required'],
      trim: true,
      minlength: [2, 'Task text must be at least 2 characters'],
      maxlength: [200, 'Task text cannot exceed 200 characters']
    },
    completed: {
      type: Boolean,
      default: false
    },
    completedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    order: {
      type: Number,
      default: 0
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

ChecklistTaskSchema.index({ mission: 1, order: 1 });

export const ChecklistTask = mongoose.model('ChecklistTask', ChecklistTaskSchema);
