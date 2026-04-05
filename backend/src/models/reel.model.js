const mongoose = require('mongoose');

const reelSchema = new mongoose.Schema({
  videoUrl: { type: String, required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }
}, {
  timestamps: true,
  toJSON: { virtuals: true, transform: (doc, ret) => { ret.id = ret._id; delete ret._id; delete ret.__v; } }
});

module.exports = { Reel: mongoose.model('Reel', reelSchema) };
