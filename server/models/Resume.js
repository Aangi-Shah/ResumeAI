const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fileName: { type: String, required: true },
  extractedText: { type: String, required: true },
  aiAnalysis: {
    score: Number,
    strengths: [String],
    weaknesses: [String],
    improvedBullets: [{
      original: String,
      improved: String
    }],
    missingKeywords: [String],
    summary: String
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resume', resumeSchema);
