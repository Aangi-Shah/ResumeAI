const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  company: { type: String, required: true },
  jobTitle: { type: String, required: true },
  jobUrl: { type: String },
  dateApplied: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['Applied', 'Interview Scheduled', 'Interview Done', 'Offer Received', 'Rejected'],
    default: 'Applied'
  },
  priority: { 
    type: String, 
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium'
  },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Application', applicationSchema);
