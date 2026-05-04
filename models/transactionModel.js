import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'user' },
    categoryId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'category' },
    amount: { type: Number, required: true, max: 100000000 },
    date: { type: Date, required: true, default: Date.now },
    note: { type: 'String', required: true, trim: true, minLength: 2, maxLength: 500 }
});

const transaction = mongoose.model('transaction', transactionSchema);

export default transaction;