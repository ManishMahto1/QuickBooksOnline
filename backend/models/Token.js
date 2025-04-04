import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema({
  accessToken: String,
  refreshToken: String,
  realmId: String,
  expiresIn: Number,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Token', tokenSchema);