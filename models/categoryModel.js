import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'user' },
    name: { type: 'String', required: true, trim: true, minLength: 2, maxLength: 50 },
    categoryType: { type: 'String', required: true, enum: ['income', 'expense'] },
    color: { type: 'String', required: true, trim: true },
    isDelete: { type: Boolean, default: false }
});

categorySchema.index({ userId: 1, name: 1 }, { unique: true });
categorySchema.index({ userId: 1, color: 1 }, { unique: true });

const category = mongoose.model('category', categorySchema);

export default category;