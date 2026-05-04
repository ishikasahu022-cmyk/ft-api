import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'user' },
    otp: { type: 'string', required: true, maxLength: 6 },
    createdAt: { type: Date, expires: '15m', default: Date.now }
});

const Otp = mongoose.model('otp', otpSchema);

export default Otp;