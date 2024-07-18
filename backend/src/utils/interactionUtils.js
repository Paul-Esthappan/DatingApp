const User = require('../models/userSchema'); 
const Interaction = require('../models/interactionSchema');
const mongoose = require('mongoose')

const getInteractionDocument = async (userId) => {
    let interaction = await Interaction.findOne({ userId });
    if (!interaction) {
        interaction = new Interaction({ userId });
        await interaction.save();
    }
    return interaction;
};

const updateSentRequests = async (interaction, toUserId) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const toUser = await User.findById(toUserId).session(session);
        if (!toUser) {
            console.error('User not found:', toUserId);
            throw new Error('User not found');
        }

        // Check if the sent request already exists
        const existingSentRequest = interaction.sentRequests.find(
            (req) => req.user.toString() === toUserId.toString()
        );

        if (existingSentRequest) {
            console.log('Request already sent to user:', toUserId);
            await session.abortTransaction();
            return false;
        }

        // Add to the sent requests of the current user
        interaction.sentRequests.push({
            user: toUserId,
            displayName: toUser.displayName,
            image: toUser.image,
            status: 'pending',
        });

        // Find the interaction of the receiving user
        let toUserInteraction = await Interaction.findOne({ user: toUserId }).session(session);
        if (!toUserInteraction) {
            console.log('Creating new interaction document for user:', toUserId);
            toUserInteraction = new Interaction({
                userId: toUserId,
                sentRequests: [],
                receivedRequests: [],
                shortlisted: [],
                friends: [],
                blocked: [],
                hiddenFeeds: [],
                messages: [],
            });
        }

        // Check if the received request already exists
        const existingReceivedRequest = toUserInteraction.receivedRequests.find(
            (req) => req.user.toString() === interaction.userId.toString()
        );

        if (existingReceivedRequest) {
            console.log('Request already received from user:', interaction.userId);
            await session.abortTransaction();
            return false;
        }

        console.log("interaction user ID", interaction.userId);
        const interactionUser = await User.findById(interaction.userId).session(session);
        if (!interactionUser) {
            console.error('Interaction user not found:', interaction.userId);
            throw new Error('Interaction user not found');
        }
        console.log("interaction user is", interactionUser);

        // Add to the received requests of the receiving user
        toUserInteraction.receivedRequests.push({
            user: interactionUser._id,
            displayName: interactionUser.displayName,
            image: interactionUser.image,
            status: 'pending',
        });

        // Save both interactions
        await interaction.save({ session });
        await toUserInteraction.save({ session });

        await session.commitTransaction();
        console.log('Sent request updated for interaction:', interaction._id);
        return true;
    } catch (err) {
        await session.abortTransaction();
        console.error('Error updating sent requests:', err.message);
        throw err; // Re-throw the error to be handled by the caller
    } finally {
        session.endSession();
    }
};




const deleteSentRequest = async (interaction, requestId) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Find the sent request to delete
        const sentRequestIndex = interaction.sentRequests.findIndex(request => request._id.toString() === requestId);
        if (sentRequestIndex === -1) {
            await session.abortTransaction();
            return false;
        }

        // Get details of the request to delete
        const sentRequest = interaction.sentRequests[sentRequestIndex];

        // Find the interaction of the user who received the request
        const receiverId = sentRequest.user;
        const receiverInteraction = await Interaction.findOne({ user: receiverId }).session(session);
        if (!receiverInteraction) {
            console.error('Interaction not found for user:', receiverId);
            await session.abortTransaction();
            return false;
        }

        // Find the corresponding received request to delete
        const receivedRequestIndex = receiverInteraction.receivedRequests.findIndex(request =>
            request.user.toString() === interaction.user.toString() && request._id.toString() === requestId
        );
        if (receivedRequestIndex === -1) {
            console.error('Received request not found for user:', receiverId);
            await session.abortTransaction();
            return false;
        }

        // Remove the sent request from the sender's interaction
        interaction.sentRequests.splice(sentRequestIndex, 1);

        // Remove the received request from the receiver's interaction
        receiverInteraction.receivedRequests.splice(receivedRequestIndex, 1);

        // Save both interaction documents
        await interaction.save({ session });
        await receiverInteraction.save({ session });

        await session.commitTransaction();
        return true;
    } catch (err) {
        await session.abortTransaction();
        console.error('Error in deleteSentRequest:', err.message);
        throw new Error('Failed to delete sent request');
    } finally {
        session.endSession();
    }
};

const deleteReceivedRequest = async (interaction, requestId) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Find the received request to delete
        const receivedRequestIndex = interaction.receivedRequests.findIndex(request => request._id.toString() === requestId);
        if (receivedRequestIndex === -1) {
            await session.abortTransaction();
            return false;
        }

        // Get details of the request to delete
        const receivedRequest = interaction.receivedRequests[receivedRequestIndex];

        // Find the interaction of the user who sent the request
        const senderId = receivedRequest.user;
        const senderInteraction = await Interaction.findOne({ user: senderId }).session(session);
        if (!senderInteraction) {
            console.error('Interaction not found for user:', senderId);
            await session.abortTransaction();
            return false;
        }

        // Find the corresponding sent request to delete
        const sentRequestIndex = senderInteraction.sentRequests.findIndex(request =>
            request.user.toString() === interaction.user.toString() && request._id.toString() === requestId
        );
        if (sentRequestIndex === -1) {
            console.error('Sent request not found for user:', senderId);
            await session.abortTransaction();
            return false;
        }

        // Remove the received request from the receiver's interaction
        interaction.receivedRequests.splice(receivedRequestIndex, 1);

        // Remove the sent request from the sender's interaction
        senderInteraction.sentRequests.splice(sentRequestIndex, 1);

        // Save both interaction documents
        await interaction.save({ session });
        await senderInteraction.save({ session });

        await session.commitTransaction();
        return true;
    } catch (err) {
        await session.abortTransaction();
        console.error('Error in deleteReceivedRequest:', err.message);
        throw new Error('Failed to delete received request');
    } finally {
        session.endSession();
    }
};



const rejectReceivedRequest = async (interaction, fromUserId) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Find the received request to reject
        const receivedRequestIndex = interaction.receivedRequests.findIndex(request =>
            request.user.toString() === fromUserId && request.status === 'pending'
        );

        if (receivedRequestIndex !== -1) {
            // Update the status of the received request to 'rejected'
            interaction.receivedRequests[receivedRequestIndex].status = 'rejected';

            // Find the interaction of the user who sent the request
            const fromUserInteraction = await Interaction.findOne({ user: fromUserId }).session(session);
            if (!fromUserInteraction) {
                console.error('Interaction not found for user:', fromUserId);
                throw new Error('Interaction not found');
            }

            // Find the corresponding sent request
            const sentRequestIndex = fromUserInteraction.sentRequests.findIndex(request =>
                request.user.toString() === interaction.user.toString() && request.status === 'pending'
            );

            if (sentRequestIndex !== -1) {
                // Update the status of the sent request to 'rejected'
                fromUserInteraction.sentRequests[sentRequestIndex].status = 'rejected';
            } else {
                console.error('Sent request not found for user:', fromUserId);
                await session.abortTransaction();
                return false;
            }

            // Save both interaction documents
            await interaction.save({ session });
            await fromUserInteraction.save({ session });

            await session.commitTransaction();
            return true;
        } else {
            // No received request found to reject
            await session.abortTransaction();
            return false;
        }
    } catch (err) {
        await session.abortTransaction();
        console.error('Error in rejectReceivedRequest:', err.message);
        throw new Error('Failed to reject received request');
    } finally {
        session.endSession();
    }
};


const updateSentRequestStatus = async (interaction, requestId, status) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Find the sent request to update
        const requestIndex = interaction.sentRequests.findIndex(request => request._id.toString() === requestId);
        if (requestIndex === -1) {
            await session.abortTransaction();
            return false;
        }

        // Update the status of the sent request
        const sentRequest = interaction.sentRequests[requestIndex];
        sentRequest.status = status;

        // Find the interaction of the user who received the request
        const receiverId = sentRequest.user;
        const receiverInteraction = await Interaction.findOne({ user: receiverId }).session(session);
        if (!receiverInteraction) {
            console.error('Interaction not found for user:', receiverId);
            await session.abortTransaction();
            return false;
        }

        // Find the corresponding received request
        const receivedRequestIndex = receiverInteraction.receivedRequests.findIndex(request =>
            request.user.toString() === interaction.user.toString() && request._id.toString() === requestId
        );

        if (receivedRequestIndex === -1) {
            console.error('Received request not found for user:', receiverId);
            await session.abortTransaction();
            return false;
        }

        // Update the status of the received request
        receiverInteraction.receivedRequests[receivedRequestIndex].status = status;

        // Save both interaction documents
        await interaction.save({ session });
        await receiverInteraction.save({ session });

        await session.commitTransaction();
        return true;
    } catch (err) {
        await session.abortTransaction();
        console.error('Error in updateSentRequestStatus:', err.message);
        throw new Error('Failed to update sent request status');
    } finally {
        session.endSession();
    }
};

const updateReceivedRequestStatus = async (interaction, requestId, status) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Find the received request to update
        const requestIndex = interaction.receivedRequests.findIndex(request => request._id.toString() === requestId);
        if (requestIndex === -1) {
            await session.abortTransaction();
            return false;
        }

        // Update the status of the received request
        const receivedRequest = interaction.receivedRequests[requestIndex];
        receivedRequest.status = status;

        // Find the interaction of the user who sent the request
        const senderId = receivedRequest.user;
        const senderInteraction = await Interaction.findOne({ user: senderId }).session(session);
        if (!senderInteraction) {
            console.error('Interaction not found for user:', senderId);
            await session.abortTransaction();
            return false;
        }

        // Find the corresponding sent request
        const sentRequestIndex = senderInteraction.sentRequests.findIndex(request =>
            request.user.toString() === interaction.user.toString() && request._id.toString() === requestId
        );

        if (sentRequestIndex === -1) {
            console.error('Sent request not found for user:', senderId);
            await session.abortTransaction();
            return false;
        }

        // Update the status of the sent request
        senderInteraction.sentRequests[sentRequestIndex].status = status;

        // Save both interaction documents
        await interaction.save({ session });
        await senderInteraction.save({ session });

        await session.commitTransaction();
        return true;
    } catch (err) {
        await session.abortTransaction();
        console.error('Error in updateReceivedRequestStatus:', err.message);
        throw new Error('Failed to update received request status');
    } finally {
        session.endSession();
    }
};


const toggleShortlist = async (currentUserInteraction, userIdToShortlist) => {
    console.log("cuser", currentUserInteraction, "other", userIdToShortlist);
    try {
        if (!currentUserInteraction.shortlist) {
            currentUserInteraction.shortlist = [];
        }

        const index = currentUserInteraction.shortlist.findIndex(item => item.userId.equals(userIdToShortlist));
        const currentUserID = currentUserInteraction.userId;
        const currentUserData = await User.findById(currentUserID);
        const shortlistedUserData = await User.findById(userIdToShortlist);
        console.log("current user", currentUserData, "shortlistuserdata", shortlistedUserData);

        if (index === -1) {
            // User not shortlisted, add to current user's shortlist
            currentUserInteraction.shortlist.push({
                userId: userIdToShortlist,
                displayName: shortlistedUserData.displayName,
                image: shortlistedUserData.image,
            });

            // Find the interaction of the user being shortlisted
            let targetUserInteraction = await Interaction.findOne({ userId: userIdToShortlist });

            if (!targetUserInteraction) {
                // If target user's interaction document not found, create a new one
                targetUserInteraction = new Interaction({ userId: userIdToShortlist, shortlistedby: [] });
            } else if (!targetUserInteraction.shortlistedby) {
                targetUserInteraction.shortlistedby = [];
            }

            // Add current user to the target user's shortlistedby
            targetUserInteraction.shortlistedBy.push({
                userId: currentUserInteraction.userId,
                displayName: currentUserData.displayName,
                image: currentUserData.image,
            });

            // Save changes to target user's interaction
            await targetUserInteraction.save();
        } else {
            // User already shortlisted, remove from current user's shortlist
            currentUserInteraction.shortlist.splice(index, 1);

            // Find the interaction of the user being un-shortlisted
            const targetUserInteraction = await Interaction.findOne({ userId: userIdToShortlist });

            if (targetUserInteraction) {
                if (!targetUserInteraction.shortlistedBy) {
                    targetUserInteraction.shortlistedBy = [];
                }

                // Remove current user from the target user's shortlistedby
                const targetIndex = targetUserInteraction.shortlistedBy.findIndex(item => item.userId.equals(currentUserInteraction.userId));
                if (targetIndex !== -1) {
                    targetUserInteraction.shortlistedBy.splice(targetIndex, 1);
                }

                // Save changes to target user's interaction
                await targetUserInteraction.save();
            }
        }

        // Save changes to current user's interaction
        await currentUserInteraction.save();

        
        return true;
    } catch (err) {
        console.error('Error in toggleShortlist:', err.message);
        return false;
    }
};




const sendFriendRequest = async (senderInteraction, receiverId) => {
    try {
        // Fetch user data for both sender and receiver
        const senderUserId = senderInteraction.userId;
        const senderUser = await User.findById(senderUserId);
        const receiverUser = await User.findById(receiverId);

        if (!senderUser || !receiverUser) {
            console.error('Invalid user data.');
            return false;
        }

        // Check if the receiver is already a friend
        const isFriend = senderInteraction.friends.some(friend => friend.equals(receiverId));
        if (isFriend) {
            console.error('User is already a friend.');
            return false;
        }

        // Check if a friend request has already been sent
        const existingRequest = senderInteraction.sentFriendRequests.find(request =>
            request.userId.equals(receiverId) && request.status === 'pending'
        );
        if (existingRequest) {
            console.error('Friend request already sent.');
            return false;
        }

        // Add a new sent request to sender's interaction
        senderInteraction.sentFriendRequests.push({
            userId: receiverId,
            displayName: receiverUser.displayName,
            image: receiverUser.image,
            status: 'pending',
        });

        // Save changes to sender's interaction
        await senderInteraction.save();

        // Fetch or create interaction document for the receiver
        let receiverInteraction = await Interaction.findOne({ userId: receiverId });
        if (!receiverInteraction) {
            receiverInteraction = new Interaction({ userId: receiverId });
        }

        // Add current user to the receiver's received friend requests
        receiverInteraction.receivedFriendRequests.push({
            userId: senderUserId,
            displayName: senderUser.displayName,
            image: senderUser.image,
            status: 'pending',
        });

        // Save changes to receiver's interaction
        await receiverInteraction.save();

        return true;
    } catch (err) {
        console.error('Error in sendFriendRequest:', err.message);
        return false;
    }
};

const acceptFriendRequest = async (receiverInteraction, senderId) => {
    try {
        // Find the received request to accept
        const receivedRequest = receiverInteraction.receivedFriendRequests.find(request =>
            request.userId.equals(senderId) && request.status === 'pending'
        );
        if (!receivedRequest) {
            console.error('Friend request not found.');
            return false;
        }

        // Update the status of the received request to 'accepted'
        receivedRequest.status = 'accepted';

        // Add sender to receiver's friends list
        receiverInteraction.friends.push(senderId);

        // Find sender's interaction to update the sent request status
        const senderInteraction = await Interaction.findOne({ userId: senderId });
        if (!senderInteraction) {
            console.error('Interaction not found for sender.');
            return false;
        }

        // Find the corresponding sent request to update its status
        const sentRequest = senderInteraction.sentFriendRequests.find(request =>
            request.userId.equals(receiverInteraction.userId) && request.status === 'pending'
        );
        if (!sentRequest) {
            console.error('Sent request not found.');
            return false;
        }

        // Update the status of the sent request to 'accepted'
        sentRequest.status = 'accepted';

        // Add receiver to sender's friends list
        senderInteraction.friends.push(receiverInteraction.userId);

        // Save changes to both interactions
        await receiverInteraction.save();
        await senderInteraction.save();
        return true;
    } catch (err) {
        console.error('Error in acceptFriendRequest:', err.message);
        return false;
    }
};

const rejectFriendRequest = async (receiverInteraction, senderId) => {
    try {
        // Find the received request to reject
        const receivedRequest = receiverInteraction.receivedFriendRequests.find(request =>
            request.userId.equals(senderId) && request.status === 'pending'
        );
        if (!receivedRequest) {
            console.error('Friend request not found.');
            return false;
        }

        // Remove the received request from receiver's interaction
        receiverInteraction.receivedFriendRequests = receiverInteraction.receivedFriendRequests.filter(request =>
            !(request.userId.equals(senderId) && request.status === 'pending')
        );

        // Find sender's interaction to update the sent request status
        const senderInteraction = await Interaction.findOne({ userId: senderId });
        if (!senderInteraction) {
            console.error('Interaction not found for sender.');
            return false;
        }

        // Remove the corresponding sent request from sender's interaction
        senderInteraction.sentFriendRequests = senderInteraction.sentFriendRequests.filter(request =>
            !(request.userId.equals(receiverInteraction.userId) && request.status === 'pending')
        );

        // Save changes to both interactions
        await receiverInteraction.save();
        await senderInteraction.save();
        return true;
    } catch (err) {
        console.error('Error in rejectFriendRequest:', err.message);
        return false;
    }
};

const deleteFriendRequest = async (currentUserInteraction, userIdToRemove) => {
    try {
        // Remove the sent request from the current user's interaction
        currentUserInteraction.sentFriendRequests = currentUserInteraction.sentFriendRequests.filter(request =>
            !(request.userId.equals(userIdToRemove) && request.status === 'pending')
        );

        // Find the interaction of the user who received the request
        const receiverInteraction = await Interaction.findOne({ userId: userIdToRemove });
        if (!receiverInteraction) {
            console.error('Interaction not found for receiver.');
            return false;
        }

        // Remove the received request from the receiver's interaction
        receiverInteraction.receivedFriendRequests = receiverInteraction.receivedFriendRequests.filter(request =>
            !(request.userId.equals(currentUserInteraction.userId) && request.status === 'pending')
        );

        // Save changes to both interactions
        await currentUserInteraction.save();
        await receiverInteraction.save();
        return true;
    } catch (err) {
        console.error('Error in deleteFriendRequest:', err.message);
        return false;
    }
};



const blockUser = async (currentUserInteractionId, userIdToBlock) => {
    try {
 

        // Fetch the current user's interaction document
        let currentUserInteraction = await Interaction.findOne({userId:currentUserInteractionId});

        // If no interaction found, create a new one
        if (!currentUserInteraction) {
            currentUserInteraction = new Interaction({
                userId: currentUserInteraction,
                friends: [],
                blocked: [],
                sentFriendRequests: [],
                receivedFriendRequests: [],
            });
        }

        // Ensure blocked is an array
        if (!Array.isArray(currentUserInteraction.blocked)) {
            currentUserInteraction.blocked = [];
        }

        // Check if the user is already blocked
        if (currentUserInteraction.blocked.includes(userIdToBlock)) {
            console.error('User is already blocked.');
            return false;
        }

        // Add user to blocked users list
        currentUserInteraction.blocked.push(userIdToBlock);

        // Remove user from friends list if already a friend
        const indexInFriends = currentUserInteraction.friends.findIndex(friend => friend.equals(userIdToBlock));
        if (indexInFriends !== -1) {
            currentUserInteraction.friends.splice(indexInFriends, 1);
        }

        // Save changes to current user's interaction
        await currentUserInteraction.save();
        return true;
    } catch (err) {
        console.error('Error in blockUser:', err.message);
        return false;
    }
};

const unblockUser = async (currentUserInteractionId, userIdToUnblock) => {
    try {

        // Fetch the current user's interaction document
        let currentUserInteraction = await Interaction.findOne({userId:currentUserInteractionId});

        // If no interaction found, create a new one
        if (!currentUserInteraction) {
            currentUserInteraction = new Interaction({
                userId: currentUserInteractionId,
                friends: [],
                blocked: [],
                sentFriendRequests: [],
                receivedFriendRequests: [],
            });
        }

        // Ensure blocked is an array
        if (!Array.isArray(currentUserInteraction.blocked)) {
            currentUserInteraction.blocked = [];
        }

        // Check if the user is blocked
        const indexInBlocked = currentUserInteraction.blocked.findIndex(blocked => blocked.equals(userIdToUnblock));
        if (indexInBlocked === -1) {
            console.error('User is not blocked.');
            return false;
        }

        // Remove user from blocked users list
        currentUserInteraction.blocked.splice(indexInBlocked, 1);

        // Save changes to current user's interaction
        await currentUserInteraction.save();
        return true;
    } catch (err) {
        console.error('Error in unblockUser:', err.message);
        return false;
    }
};




const toggleHideFeed = async (currentUserInteraction, userIdToHide) => {
    try {
        const index = currentUserInteraction.hiddenFeeds.findIndex(feed => feed.userId.equals(userIdToHide));

        if (index === -1) {
            // User not hidden, add to current user's hidden feeds
            currentUserInteraction.hiddenFeeds.push({
                userId: userIdToHide,
                displayName: "", // Update with actual display name
                image: "", // Update with actual image URL
            });

            // Find the interaction of the user whose feed is hidden
            let targetUserInteraction = await Interaction.findOne({ userId: userIdToHide });

            if (!targetUserInteraction) {
                // If target user's interaction document not found, create a new one
                targetUserInteraction = new Interaction({ userId: userIdToHide });
            }

            // Add current user to the target user's hiddenBy
            targetUserInteraction.hiddenBy.push({
                userId: currentUserInteraction.userId,
                displayName: "", // Update with actual display name
                image: "", // Update with actual image URL
            });

            // Save changes to target user's interaction
            await targetUserInteraction.save();
        } else {
            // User already hidden, remove from current user's hidden feeds
            currentUserInteraction.hiddenFeeds.splice(index, 1);

            // Find the interaction of the user whose feed is unhidden
            const targetUserInteraction = await Interaction.findOne({ userId: userIdToHide });

            if (targetUserInteraction) {
                // Remove current user from the target user's hiddenBy
                const targetIndex = targetUserInteraction.hiddenBy.findIndex(item => item.userId.equals(currentUserInteraction.userId));
                if (targetIndex !== -1) {
                    targetUserInteraction.hiddenBy.splice(targetIndex, 1);
                }

                // Save changes to target user's interaction
                await targetUserInteraction.save();
            }
        }

        // Save changes to current user's interaction
        await currentUserInteraction.save();
        return true;
    } catch (err) {
        console.error('Error in toggleHideFeed:', err.message);
        return false;
    }
};



module.exports = {
    getInteractionDocument,
    updateSentRequests,
    deleteSentRequest,
    deleteReceivedRequest,
    rejectReceivedRequest,
    updateSentRequestStatus,
    updateReceivedRequestStatus,
    toggleShortlist,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    deleteFriendRequest,
    blockUser,
    unblockUser,
    toggleHideFeed
};
