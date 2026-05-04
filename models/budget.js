import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'user' },
    name: { type: 'String', required: true, trim: true, minLength: 2, maxLength: 50 },
    categoryIds: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'category' }],
    amount: { type: Number, required: true, max: 100000000 },
    timeFrame: { type: String, required: true, enum: ['monthly', 'yearly', 'custom'] },
    startDate: { type: Date },
    endDate: { type: Date }
});

const budget = mongoose.model('budget', budgetSchema);

export default budget;