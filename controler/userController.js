import user from '../models/userModel.js'
import Otp from '../models/otpModel.js'
import otpGenerator from "otp-generator";
import bcrypt from "bcrypt"

export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const isExist = await user.findOne({ email })
        if (isExist) {
            return res.status(400).json({ message: 'User already exist' });
        }
        const userData = new user({ name, email, password });
        const isSaved = await userData.save();
        res.status(200).json({ message: 'User registered successfully' });
    }
    catch (err) {
        if (err.name === "ValidationError") {
            const errors = Object.values(err.errors).map(e => e.message);

            return res.status(400).json({
                message: "Validation failed",
                errors
            });
        }
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userData = await user.findOne({ email });

        if (!userData || !(await userData.comparePassword(password))) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });
        const otpData = new Otp({ userId: userData._id, otp: otp });
        const isSaved = await otpData.save();
        res.status(200).json({ message: 'Login successful. An OTP has been sent to your email.', otp: otp });
    }
    catch (err) {
        console.log('err == ', err);
        res.status(500).json({ message: "Server error" });
    }
}

export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const userData = await user.findOne({ email });

        if (!userData) {
            return res.status(400).json({ message: 'User not found' });
        }
        const otpData = await Otp.findOne({ userId: userData?._id }).sort({ _id: -1 }).limit(1);

        if (!otpData || otp != otpData?.otp) {
            return res.status(400).json({ message: 'Invalid otp or otp expired.' });
        }
        const token = await userData.generateToken();
        res.status(200).json({ message: 'User verifyed successful.', token: token });
    }
    catch (err) {
        console.log('err == ', err);
        res.status(500).json({ message: "Server error" });
    }
}

export const userDetail = async (req, res) => {
    try {
        const userId = req.userId;
        let userData = await user.findOne({ _id: userId });
        if (!userData) {
            return res.status(400).json({ message: 'user not found' });
        }
        userData = userData.toObject();
        delete userData.password
        res.status(200).json({ message: 'User verifyed successful.', data: userData });
    }
    catch (err) {
        console.log('err == ', err);
        res.status(500).json({ message: "Server error" });
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { name, userName, email, password, phoneNumber, dob, address } = req.body;
        const userId = req.userId;
        const userData = await user.findOne({ _id: userId, email });
        if (!userData) {
            return res.status(400).json({ message: 'user not found' });
        }

        let updatedData = {};
        if (name) updatedData.name = name;
        if (userName) updatedData.userName = userName;
        if (phoneNumber) updatedData.phoneNumber = phoneNumber;
        if (dob) updatedData.dob = dob;
        if (address) updatedData.address = address;

        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);
            updatedData.password = hashPassword;
        }

        let savedData = await user.findByIdAndUpdate({ _id: userId }, { $set: updatedData }, { returnDocument: 'after' });
        savedData = savedData.toObject();
        delete savedData.password
        res.status(201).json({ message: 'Profile update successful.', data: savedData });
    }
    catch (err) {
        console.log('err == ', err);
        res.status(500).json({ message: "Server error" });
    }
}