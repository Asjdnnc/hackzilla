const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Member name is required'],
    trim: true
  },
  collegeName: {
    type: String,
    required: [true, 'College name is required'],
    trim: true
  },
  isFromIIITS: {
    type: Boolean,
    default: false
  }
});

const foodStatusSchema = new mongoose.Schema({
  lunch: {
    type: String,
    enum: ['valid', 'invalid'],
    default: 'invalid'
  },
  dinner: {
    type: String,
    enum: ['valid', 'invalid'],
    default: 'invalid'
  },
  snacks: {
    type: String,
    enum: ['valid', 'invalid'],
    default: 'invalid'
  }
});

const teamSchema = new mongoose.Schema({
  teamId: {
    type: String,
    required: false,
    unique: true
  },
  name: {
    type: String,
    required: [true, 'Team name is required'],
    trim: true
  },
  leader: {
    type: String,
    required: [true, 'Team leader is required'],
    trim: true
  },
  members: [{
    name: {
      type: String,
      required: true
    },
    collegeName: {
    type: String,
    required: true
  },
    isFromIIITS: {
      type: Boolean,
      default: false
    }
  }],
  status: {
    type: String,
    enum: ['valid', 'invalid'],
    default: 'invalid'
  },
  allotment: {
    type: String,
    enum: ['valid', 'invalid'],
    default: 'invalid'
  },
  foodStatus: {
    lunch: {
      type: String,
      enum: ['valid', 'invalid'],
      default: 'invalid'
    },
    dinner: {
      type: String,
      enum: ['valid', 'invalid'],
      default: 'invalid'
    },
    snacks: {
      type: String,
      enum: ['valid', 'invalid'],
      default: 'invalid'
    }
  },
  qrData: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
teamSchema.index({ teamId: 1 }, { unique: true });
teamSchema.index({ name: 1 }, { unique: true });

module.exports = mongoose.model('Team', teamSchema);
