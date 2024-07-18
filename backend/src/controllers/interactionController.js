// const Interaction = require('../models/interactionSchema');
// const { getInteractionDocument, updateSentRequests, updateReceivedRequests, toggleShortlist, toggleFriend, toggleBlock, toggleHideFeed, addMessage, markMessageReads, cancelAcceptedRequest, rejectReceivedRequest, cancelSentRequest } = require('../utils/interactionUtils');

// const getInteractionForLoggedInUser = async (req, res) => {
//     try {
//         const interaction = await getInteractionDocument(req.user._id);
//         res.status(200).json(interaction);
//     } catch (err) {
//         console.error('Error fetching interaction document:', err.message);
//         res.status(500).json({ error: 'Failed to fetch interaction document' });
//     }
// };

// const sendRequest = async (req, res) => {
//     try {
//         const { toUserId } = req.body;
//         const interaction = await getInteractionDocument(req.user._id);

//         if (await updateSentRequests(interaction, toUserId)) {
//             res.status(200).json({ message: 'Friend request sent' });
//         } else {
//             res.status(400).json({ message: 'Request already sent' });
//         }
//     } catch (err) {
//         console.error('Error in sendRequest:', err.message);
//         res.status(500).json({ error: err.message });
//     }
// };


// const acceptRequest = async (req, res) => {
//     try {
//         const { fromUserId } = req.body;
//         const interaction = await getInteractionDocument(req.user._id);

//         if (await updateReceivedRequests(interaction, fromUserId)) {
//             res.status(200).json({ message: 'Friend request accepted' });
//         } else {
//             res.status(400).json({ message: 'Request not found' });
//         }
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };


// const cancelSentRequestHandler = async (req, res) => {
//     try {
//         const { toUserId } = req.body;
//         const interaction = await getInteractionDocument(req.user._id);

//         if (await cancelSentRequest(interaction, toUserId)) {
//             res.status(200).json({ message: 'Friend request canceled' });
//         } else {
//             res.status(400).json({ message: 'No such request found' });
//         }
//     } catch (err) {
//         console.error('Error in cancelSentRequestHandler:', err.message);
//         res.status(500).json({ error: 'Failed to cancel the friend request' });
//     }
// };

// const cancelAcceptedRequestHandler = async (req, res) => {
//     try {
//         const { toUserId } = req.body;
//         const interaction = await getInteractionDocument(req.user._id);

//         // Check if there is an accepted request to cancel
//         const acceptedRequest = interaction.sentRequests.find(request => request.user.toString() === toUserId && request.status === 'accepted');

//         if (!acceptedRequest) {
//             return res.status(400).json({ message: 'No accepted request found to cancel' });
//         }

//         // Perform cancellation (you may want to update the status or remove the request entirely)
//         // Example using a function that marks the request as canceled
//         const canceled = await cancelAcceptedRequest(interaction, toUserId);

//         if (canceled) {
//             res.status(200).json({ message: 'Accepted request canceled successfully' });
//         } else {
//             res.status(400).json({ message: 'Failed to cancel the accepted request' });
//         }
//     } catch (err) {
//         console.error('Error in cancelAcceptedRequestHandler:', err.message);
//         res.status(500).json({ error: 'Failed to cancel the accepted request' });
//     }
// };


// const rejectReceivedRequestHandler = async (req, res) => {
//     try {
//         const { fromUserId } = req.body;
        
//         // Fetch the interaction document for the logged-in user
//         const interaction = await getInteractionDocument(req.user._id);

//         // Call the function to reject the received request
//         if (await rejectReceivedRequest(interaction, fromUserId)) {
//             res.status(200).json({ message: 'Received request rejected successfully' });
//         } else {
//             res.status(404).json({ message: 'Received request not found or already rejected' });
//         }
//     } catch (err) {
//         console.error('Error in rejectReceivedRequestHandler:', err.message);
//         res.status(500).json({ error: 'Failed to reject received request' });
//     }
// };


// const shortlistUser = async (req, res) => {
//     try {
//         const { userIdToShortlist } = req.body;
//         const currentUserInteraction = await getInteractionDocument(req.user._id);

//         if (!currentUserInteraction) {
//             return res.status(404).json({ message: 'Current user interaction not found' });
//         }

//         if (await toggleShortlist(currentUserInteraction, userIdToShortlist)) {
//             res.status(200).json({ message: 'User shortlisted successfully' });
//         } else {
//             res.status(400).json({ message: 'Failed to shortlist user' });
//         }
//     } catch (err) {
//         console.error('Error in shortlistUser:', err.message);
//         res.status(500).json({ error: err.message });
//     }
// };


// const removeShortlistUser = async (req, res) => {
//     try {
//         const { userIdToRemove } = req.body;
//         const currentUserInteraction = await getInteractionDocument(req.user._id);

//         if (!currentUserInteraction) {
//             return res.status(404).json({ message: 'Current user interaction not found' });
//         }

//         if (await toggleShortlist(currentUserInteraction, userIdToRemove)) {
//             res.status(200).json({ message: 'User removed from shortlist successfully' });
//         } else {
//             res.status(400).json({ message: 'Failed to remove user from shortlist' });
//         }
//     } catch (err) {
//         console.error('Error in removeShortlistUser:', err.message);
//         res.status(500).json({ error: err.message });
//     }
// };




// const addFriend = async (req, res) => {
//     try {
//         const { userIdToAdd } = req.body;
//         const interaction = await getInteractionDocument(req.user._id);

//         if (await toggleFriend(interaction, userIdToAdd)) {
//             res.status(200).json({ message: 'Friend added' });
//         } else {
//             res.status(400).json({ message: 'User already a friend' });
//         }
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };

// const removeFriend = async (req, res) => {
//     try {
//         const { userIdToRemove } = req.body;
//         const currentUserInteraction = await getInteractionDocument(req.user._id);

//         if (!currentUserInteraction) {
//             return res.status(404).json({ message: 'Current user interaction not found' });
//         }

//         if (await toggleFriend(currentUserInteraction, userIdToRemove)) {
//             res.status(200).json({ message: 'Friend removed successfully' });
//         } else {
//             res.status(400).json({ message: 'Failed to remove friend' });
//         }
//     } catch (err) {
//         console.error('Error in removeFriend:', err.message);
//         res.status(500).json({ error: err.message });
//     }
// };


// const blockUser = async (req, res) => {
//     console.log("block triggred");
//     try {
//         const { userIdToBlock } = req.body;
//         console.log("req",userIdToBlock);
//         if (!userIdToBlock) {
//             return res.status(400).json({ message: 'userIdToBlock is required' });
//         }

//         const success = await toggleBlock(req.user._id, userIdToBlock, true);

//         if (success) {
//             return res.status(200).json({ message: 'User blocked' });
//         } else {
//             return res.status(400).json({ message: 'User already blocked or interaction not found' });
//         }
//     } catch (err) {
//         console.error('Error blocking user:', err.message);
//         return res.status(500).json({ error: 'Failed to block user' });
//     }
// };

// const unblockUser = async (req, res) => {
//     try {
//         const { userIdToUnblock } = req.body;
//         if (!userIdToUnblock) {
//             return res.status(400).json({ message: 'userIdToUnblock is required' });
//         }

//         const success = await toggleBlock(req.user._id, userIdToUnblock, false);

//         if (success) {
//             return res.status(200).json({ message: 'User unblocked' });
//         } else {
//             return res.status(400).json({ message: 'User not found in blocked list or interaction not found' });
//         }
//     } catch (err) {
//         console.error('Error unblocking user:', err.message);
//         return res.status(500).json({ error: 'Failed to unblock user' });
//     }
// };



// const hideFeed = async (req, res) => {
//     try {
//         const { userIdToHide } = req.body;
//         const currentUserInteraction = await getInteractionDocument(req.user._id);

//         if (!currentUserInteraction) {
//             return res.status(404).json({ message: 'Current user interaction not found' });
//         }

//         if (await toggleHideFeed(currentUserInteraction, userIdToHide)) {
//             res.status(200).json({ message: 'Feed hidden successfully' });
//         } else {
//             res.status(400).json({ message: 'Failed to hide feed' });
//         }
//     } catch (err) {
//         console.error('Error in hideFeed:', err.message);
//         res.status(500).json({ error: err.message });
//     }
// };


// const showFeed = async (req, res) => {
//     try {
//         const { userIdToShow } = req.body;
//         const currentUserInteraction = await getInteractionDocument(req.user._id);

//         if (!currentUserInteraction) {
//             return res.status(404).json({ message: 'Current user interaction not found' });
//         }

//         if (await toggleHideFeed(currentUserInteraction, userIdToShow)) {
//             res.status(200).json({ message: 'Feed shown successfully' });
//         } else {
//             res.status(400).json({ message: 'Failed to show feed' });
//         }
//     } catch (err) {
//         console.error('Error in showFeed:', err.message);
//         res.status(500).json({ error: err.message });
//     }
// };
// ;

// const sendMessage = async (req, res) => {
//     try {
//         const { toUserId, content } = req.body;
//         const fromUserId = req.user._id;  // Assuming the sender is the logged-in user

//         const message = await addMessage(fromUserId, toUserId, content);

//         if (message) {
//             res.status(200).json({ message: 'Message sent successfully', messageData: message });
//         } else {
//             res.status(400).json({ message: 'Failed to send message' });
//         }
//     } catch (err) {
//         console.error('Error in sendMessage:', err.message);
//         res.status(500).json({ error: 'Failed to send message' });
//     }
// };


// const markMessagesAsRead = async (req, res) => {
//     try {
//         const { fromUserId } = req.body;
//         const toUserId = req.user._id;

//         const result = await markMessageReads(fromUserId, toUserId);

//         if (result) {
//             res.status(200).json({ message: 'Messages marked as read' });
//         } else {
//             res.status(400).json({ message: 'Failed to mark messages as read' });
//         }
//     } catch (err) {
//         console.error('Error in markMessagesAsRead:', err.message);
//         res.status(500).json({ error: 'Failed to mark messages as read' });
//     }
// };

// const fetchShortlistedUsers = async (req, res) => {
//     try {
//         const currentUserInteraction = await getInteractionDocument(req.user._id);

//         if (!currentUserInteraction) {
//             return res.status(404).json({ message: 'Current user interaction not found' });
//         }

//         // Extract the shortlisted users from the current user's interaction document
//         const shortlistedUserIds = currentUserInteraction.shortlisted;

//         res.status(200).json({ shortlistedUsers: shortlistedUserIds });
//     } catch (err) {
//         console.error('Error in fetchShortlistedUsers:', err.message);
//         res.status(500).json({ error: 'Failed to fetch shortlisted users' });
//     }
// };


// const fetchUsersWhoShortlistedLoggedInUser = async (req, res) => {
//     try {
//         const loggedInUserId = req.user._id;

//         // Find all interaction documents where the logged-in user is in the shortlisted list
//         const interactions = await Interaction.find({ shortlisted: loggedInUserId });

//         // Extract the user IDs of those who have shortlisted the logged-in user
//         const userIdsWhoShortlisted = interactions.map(interaction => interaction.user);

//         res.status(200).json({ usersWhoShortlisted: userIdsWhoShortlisted });
//     } catch (err) {
//         console.error('Error in fetchUsersWhoShortlistedLoggedInUser:', err.message);
//         res.status(500).json({ error: 'Failed to fetch users who shortlisted logged-in user' });
//     }
// };


// const fetchUsersBySentRequestStatus = async (req, res) => {
//     try {
//         const { status } = req.query;

//         let filteredInteractions;

//         switch (status) {
//             case 'accepted':
//                 filteredInteractions = await Interaction.find({ userId: req.user._id, 'sentRequests.status': 'accepted' }).populate('sentRequests.user');
//                 break;
//             case 'rejected':
//                 filteredInteractions = await Interaction.find({ userId: req.user._id, 'sentRequests.status': 'rejected' }).populate('sentRequests.user');
//                 break;
//             case 'pending':
//                 filteredInteractions = await Interaction.find({ userId: req.user._id, 'sentRequests.status': 'pending' }).populate('sentRequests.user');
//                 break;
//             default:
//                 throw new Error('Invalid status');
//         }

//         const usersArray = filteredInteractions.flatMap(interaction =>
//             interaction.sentRequests.map(request => ({
//                 userId: request.user._id,
//                 displayName: request.user.displayName,
//                 image: request.user.image,
//                 status: request.status
//             }))
//         );

//         res.json(usersArray);
//     } catch (err) {
//         console.error('Error fetching users by sent request status:', err.message);
//         res.status(500).json({ error: 'Failed to fetch users by sent request status' });
//     }
// };


// const fetchUsersByReceivedRequestStatus = async (req, res) => {
//     try {
//         const { status } = req.query;

//         let filteredInteractions;

//         switch (status) {
//             case 'accepted':
//                 filteredInteractions = await Interaction.find({ userId: req.user._id, 'receivedRequests.status': 'accepted' }).populate('receivedRequests.user');
//                 break;
//             case 'rejected':
//                 filteredInteractions = await Interaction.find({ userId: req.user._id, 'receivedRequests.status': 'rejected' }).populate('receivedRequests.user');
//                 break;
//             case 'pending':
//                 filteredInteractions = await Interaction.find({ userId: req.user._id, 'receivedRequests.status': 'pending' }).populate('receivedRequests.user');
//                 break;
//             default:
//                 throw new Error('Invalid status');
//         }

//         const usersArray = filteredInteractions.flatMap(interaction =>
//             interaction.receivedRequests.map(request => ({
//                 userId: request.user._id,
//                 displayName: request.user.displayName,
//                 image: request.user.image,
//                 status: request.status
//             }))
//         );

//         res.json(usersArray);
//     } catch (err) {
//         console.error('Error fetching users by sent request status:', err.message);
//         res.status(500).json({ error: 'Failed to fetch users by sent request status' });
//     }
// };


// module.exports = {
//     getInteractionForLoggedInUser,
//     sendRequest,
//     acceptRequest,
//     shortlistUser,
//     addFriend,
//     blockUser,
//     unblockUser,
//     hideFeed,
//     sendMessage,
//     markMessagesAsRead,
//     fetchUsersBySentRequestStatus,
//     fetchUsersByReceivedRequestStatus,
//     cancelSentRequestHandler,
//     fetchUsersByReceivedRequestStatus,
//     cancelAcceptedRequestHandler,
//     rejectReceivedRequestHandler,
//     removeShortlistUser,
//     removeFriend,
//     fetchShortlistedUsers,
//     fetchUsersWhoShortlistedLoggedInUser,
//     showFeed,
// };

const User = require('../models/userSchema')
const Interaction = require('../models/interactionSchema');
const {
    getInteractionDocument,
    updateSentRequests,
    deleteSentRequest,
    deleteReceivedRequest,
    rejectReceivedRequest,
    updateReceivedRequestStatus,
    toggleShortlist,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    deleteFriendRequest,
    blockUser,
    unblockUser,
    toggleHideFeed
} = require('../utils/interactionUtils');

const getInteractionForLoggedInUser = async (req, res) => {
    try {
        const interaction = await getInteractionDocument(req.user._id);
        res.status(200).json(interaction);
    } catch (err) {
        console.error('Error fetching interaction document:', err.message);
        res.status(500).json({ error: 'Failed to fetch interaction document' });
    }
};

const sendRequest = async (req, res) => {
    try {
        const { toUserId } = req.body;
        const interaction = await getInteractionDocument(req.user._id);

        if (await updateSentRequests(interaction, toUserId)) {
            res.status(200).json({ message: 'request sent' });
        } else {
            res.status(400).json({ message: 'Request already sent' });
        }
    } catch (err) {
        console.error('Error in sendRequest:', err.message);
        res.status(500).json({ error: err.message });
    }
};

const acceptRequest = async (req, res) => {
    try {
        const { fromUserId } = req.body;
        const interaction = await getInteractionDocument(req.user._id);

        if (await updateReceivedRequestStatus(interaction, fromUserId)) {
            res.status(200).json({ message: 'Friend request accepted' });
        } else {
            res.status(400).json({ message: 'Request not found' });
        }
    } catch (err) {
        console.error('Error in acceptRequest:', err.message);
        res.status(500).json({ error: err.message });
    }
};

const cancelSentRequestHandler = async (req, res) => {
    try {
        const { toUserId } = req.body;
        const interaction = await getInteractionDocument(req.user._id);

        if (await deleteSentRequest(interaction, toUserId)) {
            res.status(200).json({ message: 'Friend request canceled' });
        } else {
            res.status(400).json({ message: 'No such request found' });
        }
    } catch (err) {
        console.error('Error in cancelSentRequestHandler:', err.message);
        res.status(500).json({ error: 'Failed to cancel the friend request' });
    }
};

const cancelAcceptedRequestHandler = async (req, res) => {
    try {
        const { toUserId } = req.body;
        const interaction = await getInteractionDocument(req.user._id);

        const acceptedRequest = interaction.sentRequests.find(request => request.user.toString() === toUserId && request.status === 'accepted');

        if (!acceptedRequest) {
            return res.status(400).json({ message: 'No accepted request found to cancel' });
        }

        const canceled = await deleteReceivedRequest(interaction, toUserId);

        if (canceled) {
            res.status(200).json({ message: 'Accepted request canceled successfully' });
        } else {
            res.status(400).json({ message: 'Failed to cancel the accepted request' });
        }
    } catch (err) {
        console.error('Error in cancelAcceptedRequestHandler:', err.message);
        res.status(500).json({ error: 'Failed to cancel the accepted request' });
    }
};

const rejectReceivedRequestHandler = async (req, res) => {
    try {
        const { fromUserId } = req.body;
        const interaction = await getInteractionDocument(req.user._id);

        if (await rejectReceivedRequest(interaction, fromUserId)) {
            res.status(200).json({ message: 'Received request rejected successfully' });
        } else {
            res.status(404).json({ message: 'Received request not found or already rejected' });
        }
    } catch (err) {
        console.error('Error in rejectReceivedRequestHandler:', err.message);
        res.status(500).json({ error: 'Failed to reject received request' });
    }
};

const shortlistUser = async (req, res) => {
    console.log("shortlist triggred");
    try {
        const { userIdToShortlist } = req.body;
        const currentUserInteraction = await getInteractionDocument(req.user._id);

        if (!currentUserInteraction) {
            return res.status(404).json({ message: 'Current user interaction not found' });
        }

        if (await toggleShortlist(currentUserInteraction, userIdToShortlist)) {
            res.status(200).json({ message: 'User shortlisted successfully' });
        } else {
            res.status(400).json({ message: 'Failed to shortlist user' });
        }
    } catch (err) {
        console.error('Error in shortlistUser:', err.message);
        res.status(500).json({ error: err.message });
    }
};

const removeShortlistUser = async (req, res) => {
    try {
        const { userIdToRemove } = req.body;
        const currentUserInteraction = await getInteractionDocument(req.user._id);

        if (!currentUserInteraction) {
            return res.status(404).json({ message: 'Current user interaction not found' });
        }

        if (await toggleShortlist(currentUserInteraction, userIdToRemove)) {
            res.status(200).json({ message: 'User removed from shortlist successfully' });
        } else {
            res.status(400).json({ message: 'Failed to remove user from shortlist' });
        }
    } catch (err) {
        console.error('Error in removeShortlistUser:', err.message);
        res.status(500).json({ error: err.message });
    }
};

const addFriend = async (req, res) => {
    try {
        const { userIdToAdd } = req.body;
        const interaction = await getInteractionDocument(req.user._id);

        if (await sendFriendRequest(interaction, userIdToAdd)) {
            res.status(200).json({ message: 'Friend added' });
        } else {
            res.status(400).json({ message: 'User already a friend' });
        }
    } catch (err) {
        console.error('Error in addFriend:', err.message);
        res.status(500).json({ error: err.message });
    }
};

const acceptFriend = async (req, res) => {
    try {
        const { userIdToAdd } = req.body;
        const interaction = await getInteractionDocument(req.user._id);

        if (await acceptFriendRequest(interaction, userIdToAdd)) {
            res.status(200).json({ message: 'Friend added' });
        } else {
            res.status(400).json({ message: 'User already a friend' });
        }
    } catch (err) {
        console.error('Error in acceptFriend:', err.message);
        res.status(500).json({ error: err.message });
    }
};

const removeFriend = async (req, res) => {
    try {
        const { userIdToRemove } = req.body;
        const currentUserInteraction = await getInteractionDocument(req.user._id);

        if (!currentUserInteraction) {
            return res.status(404).json({ message: 'Current user interaction not found' });
        }

        if (await rejectFriendRequest(currentUserInteraction, userIdToRemove)) {
            res.status(200).json({ message: 'Friend removed successfully' });
        } else {
            res.status(400).json({ message: 'Failed to remove friend' });
        }
    } catch (err) {
        console.error('Error in removeFriend:', err.message);
        res.status(500).json({ error: err.message });
    }
};

const deleteFriend = async (req, res) => {
    try {
        const { userIdToRemove } = req.body;
        const currentUserInteraction = await getInteractionDocument(req.user._id);

        if (!currentUserInteraction) {
            return res.status(404).json({ message: 'Current user interaction not found' });
        }

        if (await deleteFriendRequest(currentUserInteraction, userIdToRemove)) {
            res.status(200).json({ message: 'Friend removed successfully' });
        } else {
            res.status(400).json({ message: 'Failed to remove friend' });
        }
    } catch (err) {
        console.error('Error in deleteFriend:', err.message);
        res.status(500).json({ error: err.message });
    }
};

const blockUserHandler = async (req, res) => {
    try {
        const { userIdToBlock } = req.body;



        if (!userIdToBlock) {
            return res.status(400).json({ message: 'userIdToBlock is required' });
        }

        const success = await blockUser(req.user._id, userIdToBlock);

        if (success) {
            return res.status(200).json({ message: 'User blocked' });
        } else {
            return res.status(400).json({ message: 'User already blocked or interaction not found' });
        }
    } catch (err) {
        console.error('Error blocking user:', err.message);
        return res.status(500).json({ error: 'Failed to block user' });
    }
};

const unblockUserHandler = async (req, res) => {
    console.log("unlock triigeed");
    try {
        const { userIdToUnblock } = req.body;
        console.log("reqbody",req.body);

        if (!userIdToUnblock) {
            return res.status(400).json({ message: 'userIdToUnblock is required' });
        }

        const success = await unblockUser(req.user._id, userIdToUnblock);
        console.log("su",success);

        if (success) {
            return res.status(200).json({ message: 'User unblocked' });
        } else {
            return res.status(400).json({ message: 'User not blocked or interaction not found' });
        }
    } catch (err) {
        console.error('Error unblocking user:', err.message);
        return res.status(500).json({ error: 'Failed to unblock user' });
    }
};


const toggleHideFeedHandler = async (req, res) => {
    try {
        const { userIdToHide } = req.body;

        if (!userIdToHide) {
            return res.status(400).json({ message: 'userIdToHide is required' });
        }

        if (await toggleHideFeed(req.user._id, userIdToHide)) {
            return res.status(200).json({ message: 'User feed visibility toggled' });
        } else {
            return res.status(500).json({ message: 'Failed to toggle feed visibility' });
        }
    } catch (err) {
        console.error('Error in toggleHideFeedHandler:', err.message);
        res.status(500).json({ error: 'Failed to toggle feed visibility' });
    }
};

const fetchShortlistedUsers = async (req, res) => {
   
    try {
        const currentUserInteraction = await getInteractionDocument(req.user._id);

        if (!currentUserInteraction) {
            return res.status(404).json({ message: 'Current user interaction not found' });
        }

        // Extract the shortlisted users from the current user's interaction document
        const shortlistedUserIds = currentUserInteraction.shortlist;
   

        res.status(200).json({ shortlistedUsers: shortlistedUserIds });

    } catch (err) {
        console.error('Error in fetchShortlistedUsers:', err.message);
        res.status(500).json({ error: 'Failed to fetch shortlisted users' });
    }
};


const fetchUsersWhoShortlistedLoggedInUser = async (req, res) => {
    try {

        const currentUserInteraction = await getInteractionDocument(req.user._id);

        if (!currentUserInteraction) {
            return res.status(404).json({ message: 'Current user interaction not found' });
        }

        // Extract the shortlisted users from the current user's interaction document
        const shortlistedByUserIds = currentUserInteraction.shortlistedBy;
   

        res.status(200).json({ shortlistedByUsers: shortlistedByUserIds });

    
    } catch (err) {
        console.error('Error in fetchUsersWhoShortlistedLoggedInUser:', err.message);
        res.status(500).json({ error: 'Failed to fetch users who shortlisted logged-in user' });
    }
};


const fetchUsersBySentRequestStatus = async (req, res) => {
    try {
        const { status } = req.query;

        let filteredInteractions;

        switch (status) {
            case 'accepted':
                filteredInteractions = await Interaction.find({ userId: req.user._id, 'sentRequests.status': 'accepted' }).populate('sentRequests.user');
                break;
            case 'rejected':
                filteredInteractions = await Interaction.find({ userId: req.user._id, 'sentRequests.status': 'rejected' }).populate('sentRequests.user');
                break;
            case 'pending':
                filteredInteractions = await Interaction.find({ userId: req.user._id, 'sentRequests.status': 'pending' }).populate('sentRequests.user');
                break;
            default:
                throw new Error('Invalid status');
        }

        const usersArray = filteredInteractions.flatMap(interaction =>
            interaction.sentRequests.map(request => ({
                userId: request.user._id,
                displayName: request.user.displayName,
                image: request.user.image,
                status: request.status
            }))
        );

        res.json(usersArray);
    } catch (err) {
        console.error('Error fetching users by sent request status:', err.message);
        res.status(500).json({ error: 'Failed to fetch users by sent request status' });
    }
};


const fetchUsersByReceivedRequestStatus = async (req, res) => {
    try {
        const { status } = req.query;

        let filteredInteractions;

        switch (status) {
            case 'accepted':
                filteredInteractions = await Interaction.find({ userId: req.user._id, 'receivedRequests.status': 'accepted' }).populate('receivedRequests.user');
                break;
            case 'rejected':
                filteredInteractions = await Interaction.find({ userId: req.user._id, 'receivedRequests.status': 'rejected' }).populate('receivedRequests.user');
                break;
            case 'pending':
                filteredInteractions = await Interaction.find({ userId: req.user._id, 'receivedRequests.status': 'pending' }).populate('receivedRequests.user');
                break;
            default:
                throw new Error('Invalid status');
        }

        const usersArray = filteredInteractions.flatMap(interaction =>
            interaction.receivedRequests.map(request => ({
                userId: request.user._id,
                displayName: request.user.displayName,
                image: request.user.image,
                status: request.status
            }))
        );

        res.json(usersArray);
    } catch (err) {
        console.error('Error fetching users by sent request status:', err.message);
        res.status(500).json({ error: 'Failed to fetch users by sent request status' });
    }
};

const fetchFriends = async (req, res) => {
    try {
        const currentUserInteraction = await Interaction.findOne({ userId: req.user._id }).populate('friends', 'displayName image');

        if (!currentUserInteraction) {
            return res.status(404).json({ message: 'Current user interaction not found' });
        }

        const friends = currentUserInteraction.friends.map(friend => ({
            userId: friend._id,
            displayName: friend.displayName,
            image: friend.image,
        }));

        res.status(200).json({ friends });
    } catch (err) {
        console.error('Error fetching friends:', err.message);
        res.status(500).json({ error: 'Failed to fetch friends' });
    }
};

const fetchUsersBySentFriendRequestStatus = async (req, res) => {
    try {
        const { status } = req.query;

        if (!['pending', 'accepted', 'rejected'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const currentUserInteraction = await Interaction.findOne({ userId: req.user._id });

        if (!currentUserInteraction) {
            return res.status(404).json({ message: 'Current user interaction not found' });
        }

        const filteredRequests = (currentUserInteraction.sentFriendRequests || []).filter(request => request.status === status);

        const userIds = filteredRequests.map(request => request.userId);
        console.log("userid",userIds);

        const users = await User.find({ _id: { $in: userIds } }).select('displayName image');

        const usersArray = users.map(user => ({
            userId: user._id,
            displayName: user.displayName,
            image: user.image,
            status,
        }));

        res.json(usersArray);
    } catch (err) {
        console.error('Error fetching users by sent friend request status:', err.message);
        res.status(500).json({ error: 'Failed to fetch users by sent friend request status' });
    }
};

const fetchUsersByReceivedFriendRequestStatus = async (req, res) => {
    try {
        const { status } = req.query;

        if (!['pending', 'accepted', 'rejected'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const currentUserInteraction = await Interaction.findOne({ userId: req.user._id });

        if (!currentUserInteraction) {
            return res.status(404).json({ message: 'Current user interaction not found' });
        }

        const filteredRequests = (currentUserInteraction.receivedFriendRequests || []).filter(request => request.status === status);

        const userIds = filteredRequests.map(request => request.userId);

        const users = await User.find({ _id: { $in: userIds } }).select('displayName image');

        const usersArray = users.map(user => ({
            userId: user._id,
            displayName: user.displayName,
            image: user.image,
            status,
        }));

        res.json(usersArray);
    } catch (err) {
        console.error('Error fetching users by received friend request status:', err.message);
        res.status(500).json({ error: 'Failed to fetch users by received friend request status' });
    }
};

const fetchBlockedUsers = async (req, res) => {
  try {
    const currentUserInteraction = await Interaction.findOne({ userId: req.user._id });

    if (!currentUserInteraction) {
      return res.status(404).json({ message: 'Current user interaction not found' });
    }

      const blockedUserIds = currentUserInteraction.blocked; 
      console.log("b",blockedUserIds);

    // Fetch user details for the blocked users
      const blockedUsers = await User.find({ _id: { $in: blockedUserIds } }).select('displayName image');
      console.log("blocked users",blockedUsers);

    res.status(200).json({ blockedUsers });
  } catch (err) {
    console.error('Error fetching blocked users:', err.message);
    res.status(500).json({ error: 'Failed to fetch blocked users' });
  }
};









module.exports = {
    getInteractionForLoggedInUser,
    sendRequest,
    acceptRequest,
    cancelSentRequestHandler,
    cancelAcceptedRequestHandler,
    rejectReceivedRequestHandler,
    shortlistUser,
    removeShortlistUser,
    addFriend,
    acceptFriend,
    removeFriend,
    deleteFriend,
    blockUserHandler,
    unblockUserHandler,
    toggleHideFeedHandler,
    fetchShortlistedUsers,
    fetchUsersWhoShortlistedLoggedInUser,
    fetchUsersBySentRequestStatus,
    fetchUsersByReceivedRequestStatus,
    fetchFriends,
    fetchUsersBySentFriendRequestStatus,
    fetchUsersByReceivedFriendRequestStatus,
    fetchBlockedUsers,
};
