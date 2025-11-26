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

    expriesAt: {
        type: Date,
        required: true,
    },

    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400
    }
});

BlacklistTokenSchema.index({token: 1});
BlacklistTokenSchema.index({expriesAt: 1}, {expireAfterSeconds: 0});

export default mongoose.model("BlacklistToken", BlacklistTokenSchema);
