import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken';
import { envConfig } from "../config/envConfig.js";

// 1. Define the Schema
const userSchema = new mongoose.Schema({
    name: { type: String, require: true },
    userName: { type: String },
    email: {
        type: String, require: true, unique: true, lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill valid email']
    },
    password: {
        type: String, require: true, match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
            , 'Ensures password should atleast 8 characters long and contain at least one lowercase, one uppercase letter,one digit and one special character']
    },
    phoneNumber: { type: String },
    dob: { type: Date },
    address: { type: String, trim: true, minLength: 2, maxLength: 200 },
    createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    catch (err) {
        next(err);
    }
})

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password)
};

userSchema.methods.generateToken = async function () {
    // Generate a JWT
    const token = await jwt.sign(
        { userId: this._id },
        envConfig.jwtSecret,
        { expiresIn: envConfig.expireTime });
    return token
};

const user = mongoose.model('User', userSchema);

export default user;