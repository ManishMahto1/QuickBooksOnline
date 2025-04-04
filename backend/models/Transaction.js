import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    qboId: { type: String, unique: true, sparse: true },
    type: { type: String, enum: ['purchase', 'deposit'], required: true },
    amount: Number,
    date: Date,
    payeeId: String,
    isCategorized: { type: Boolean, default: false },
});

export default mongoose.model('Transaction', transactionSchema);