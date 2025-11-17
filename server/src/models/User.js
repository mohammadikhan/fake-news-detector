import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },

    passwordHash: {
        type: String,
        required: true,
        minlength: 6,
    },

    isAdmin: {
        type: Boolean,
        default: false,
    },

    isVerified: {
        type: Boolean,
        default: false,
    },

    verificationCode: {
        type: String,
    },

    verificationCodeExpiry: {
        type: Date,
    }

}, { timestamps : true} )

export default mongoose.model("User", UserSchema)
