import mongoose from "mongoose";

const RefreshTokenSchema = new mongoose.Schema({

    token: {
        type: String,
        required: true,
        unique: true
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 2592000
    }
});

export default mongoose.model("RefreshToken", RefreshTokenSchema);
