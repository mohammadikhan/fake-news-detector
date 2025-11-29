import mongoose from "mongoose";

const BlacklistTokenSchema = new mongoose.Schema({
    
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

    expiresAt: {
        type: Date,
        required: true,
    },

    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400
    }
});

export default mongoose.model("BlacklistToken", BlacklistTokenSchema);
