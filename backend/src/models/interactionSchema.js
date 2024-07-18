const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define messageSchema
const messageSchema = new Schema({
    from: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    to: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    read: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now },
});

// Define requestSchema
const requestSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    displayName: { type: String, required: true },
    image: { type: String, required: true },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
});

// Define interactionSchema
const interactionSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    sentRequests: [requestSchema],
    receivedRequests: [requestSchema],
    shortlist: [{
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        displayName: String,
        image: String,
    }],
    shortlistedBy: [{
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        displayName: String,
        image: String,
    }],
    connected: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    receivedFriendRequests: [{
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        displayName: String,
        image: String,
        status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    }],
    sentFriendRequests: [{
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        displayName: String,
        image: String,
        status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    }],
    friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    blocked: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    hiddenFeeds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    messages: [messageSchema],
}, { timestamps: true });

// Indexing userId for quick lookups
interactionSchema.index({ userId: 1 });

// Create Interaction model
const Interaction = mongoose.model('Interaction', interactionSchema);

module.exports = Interaction;
