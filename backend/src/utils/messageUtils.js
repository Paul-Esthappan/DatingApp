const Message = require('../models/messageSchema');
const User = require('../models/userSchema');


// Example function to send a message
const sendMessage = async (fromUserId, toUserId, content) => {
    try {
        const message = new Message({
            from: fromUserId,
            to: toUserId,
            content,
        });

        await message.save();

        // Update sender's and recipient's message arrays
        await User.findByIdAndUpdate(fromUserId, { $push: { sentMessages: message._id } });
        await User.findByIdAndUpdate(toUserId, { $push: { receivedMessages: message._id } });

        return message;
    } catch (err) {
        console.error('Error in sendMessage:', err.message);
        throw new Error('Failed to send message');
    }
};

// Example function to mark a message as read
const markMessageRead = async (messageId) => {
    try {
        const message = await Message.findByIdAndUpdate(messageId, { read: true }, { new: true });

        if (!message) {
            throw new Error('Message not found');
        }

        return message;
    } catch (err) {
        console.error('Error in markMessageRead:', err.message);
        throw new Error('Failed to mark message as read');
    }
};

module.exports = { sendMessage, markMessageRead };
