// messageController.js

const Message = require('../models/messageSchema');
const User = require('../models/userSchema');

// Function to send a message
const sendMessage = async (req, res) => {
    console.log("send message triggered");
    const { id, content } = req.body;
    console.log(req.body);
    const fromUserId = req.user._id;

    try {
        const message = new Message({
            from: fromUserId,
            to: id,
            content,
        });

        await message.save();

        // Update sender's and recipient's message arrays
        await User.findByIdAndUpdate(fromUserId, { $push: { sentMessages: message._id } });
        await User.findByIdAndUpdate(id, { $push: { receivedMessages: message._id } });

        res.status(200).json({ message: 'Message sent successfully', data: message });
    } catch (err) {
        console.error('Error in sendMessage:', err.message);
        res.status(500).json({ error: 'Failed to send message' });
    }
};

// Function to mark a message as read
const markMessageRead = async (req, res) => {
    const { messageId } = req.body;

    try {
        const message = await Message.findByIdAndUpdate(messageId, { read: true }, { new: true });

        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }

        res.status(200).json({ message: 'Message marked as read', data: message });
    } catch (err) {
        console.error('Error in markMessageRead:', err.message);
        res.status(500).json({ error: 'Failed to mark message as read' });
    }
};

// Fetch chat messages between two users
const fetchChatMessages = async (req, res) => {
    console.log("fetch msg triggred");
    const fromUserId = req.user._id;
    const toUserId = req.params.id;

    try {
        const messages = await Message.find({
            $or: [
                { from: fromUserId, to: toUserId },
                { from: toUserId, to: fromUserId },
            ],
        }).populate('from', 'name').populate('to', 'name').sort({ timestamp: 1 }); // Sort by timestamp to show in order

        if (messages.length === 0) {
            // No messages found, create a placeholder message
            const placeholderMessage = {
                from: fromUserId,
                to: toUserId,
                content: 'No messages yet. Start the conversation!',
                timestamp: new Date(),
                placeholder: true
            };
            return res.status(200).json({ messages: [placeholderMessage] });
        }

        res.status(200).json({ messages });
    } catch (err) {
        console.error('Error fetching chat messages:', err.message);
        res.status(500).json({ error: 'Failed to fetch chat messages' });
    }
};

module.exports = { sendMessage, markMessageRead, fetchChatMessages };
