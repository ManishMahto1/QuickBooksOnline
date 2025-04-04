import mongoose from 'mongoose';

const payeeSchema = new mongoose.Schema({
    qboId:{ type: String, unique: true, sparse: true },
    name: String,
    type: { type: String, enum: ['vendor', 'customer'], required: true },
    active: Boolean,
});

export default mongoose.model('Payee', payeeSchema);