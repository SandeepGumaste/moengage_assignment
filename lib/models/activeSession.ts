import mongoose from 'mongoose';

export interface IActiveSession extends Document {
    userId: mongoose.Types.ObjectId;
    token: string;
    createdAt: Date;
    lastActive: Date;
}

const activeSessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    token: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastActive: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

activeSessionSchema.index({ lastActive: 1 }, { expireAfterSeconds: 7 * 24 * 60 * 60 });

const ActiveSession = mongoose.models.ActiveSession || mongoose.model<IActiveSession>('ActiveSession', activeSessionSchema);

export default ActiveSession;
