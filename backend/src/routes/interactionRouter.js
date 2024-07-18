const express = require('express');
const {
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
     fetchUsersByReceivedFriendRequestStatus,
    fetchUsersBySentFriendRequestStatus,
    fetchBlockedUsers,
} = require('../controllers/interactionController');

const authenticateToken = require('../middlewares/authenticateToken');
const router = express.Router();


router.post('/sendRequest', authenticateToken, sendRequest);
router.post('/acceptRequest', authenticateToken, acceptRequest);

router.post('/shortlistUser', authenticateToken, shortlistUser);
router.post('/removeShortList', authenticateToken, removeShortlistUser);

router.post('/addFriend', authenticateToken, addFriend);
router.post('/removeFriend', authenticateToken, removeFriend);

router.post('/blockUser',authenticateToken, blockUserHandler);
router.put('/unblockUser', authenticateToken, unblockUserHandler);



router.post('/cancelRequest',authenticateToken, cancelSentRequestHandler);
router.post('/cancelAcceptedRequest', authenticateToken, cancelAcceptedRequestHandler);
router.post('/rejectRecivedRequest', authenticateToken, rejectReceivedRequestHandler);








// router.post('/hideFeed',authenticateToken, hideFeed);
// router.post('/sendMessage',authenticateToken, sendMessage);
// router.get('/getUnreadMessages',authenticateToken, getUnreadMessages);
// router.post('/markMessageRead', authenticateToken, markMessageRead);

router.get('/receivedRequests', authenticateToken, fetchUsersByReceivedRequestStatus);
router.get('/sentRequest', authenticateToken, fetchUsersBySentRequestStatus);
router.get('/shortlisted', authenticateToken, fetchShortlistedUsers)
router.get('/shortlistedBy',authenticateToken, fetchUsersWhoShortlistedLoggedInUser)
router.get('/userInteraction', authenticateToken, getInteractionForLoggedInUser)
router.get('/friends', authenticateToken, fetchFriends)
router.get('/received-friend-requests', authenticateToken, fetchUsersByReceivedFriendRequestStatus)
router.get('/sent-friend-requests', authenticateToken, fetchUsersBySentFriendRequestStatus)
router.get('/blockedUsers', authenticateToken, fetchBlockedUsers)
module.exports = router;

