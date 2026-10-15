import mongoose from 'mongoose';

const MissionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a mission title or goal'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [120, 'Title cannot exceed 120 characters']
    },
    category: {
      type: String,
      required: [true, 'Please specify a category'],
      enum: {
        values: ['Study', 'Hackathon', 'Career', 'Projects'],
        message: '{VALUE} is not a valid category'
      }
    },
    description: {
      type: String,
      required: [true, 'Please provide a short description of the goal'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    subject: {
      type: String,
      trim: true,
      default: ''
    },
    availability: {
      type: String,
      required: [true, 'Please provide preferred timing or availability'],
      trim: true
    },
    availabilityKey: {
      type: String,
      enum: ['today_evening', 'this_weekend', 'weekday_evenings', 'flexible'],
      default: 'flexible'
    },
    groupSize: {
      type: Number,
      required: [true, 'Please specify desired group size'],
      min: [2, 'Group size must be at least 2 students'],
      max: [8, 'Group size cannot exceed 8 students'],
      default: 4
    },
    commitment: {
      type: String,
      enum: {
        values: ['Focused', 'Regular', 'Casual'],
        message: '{VALUE} is not a valid commitment pace'
      },
      default: 'Regular'
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['Active', 'Completed', 'Archived'],
      default: 'Active'
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

// Indexes for fast searching and filtering
MissionSchema.index({ category: 1, status: 1 });
MissionSchema.index({ availabilityKey: 1 });
MissionSchema.index({ createdBy: 1 });
MissionSchema.index({ title: 'text', description: 'text', subject: 'text' });

export const Mission = mongoose.model('Mission', MissionSchema);
