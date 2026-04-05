const User = require("../models/Users");

const sendFriendRequest = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (email === req.user.email) {
      return res.status(400).json({ message: "You cannot add yourself as a friend" });
    }

    const friend = await User.findOne({ email });
    if (!friend) {
      return res.status(404).json({ message: "User with this email not found" });
    }

    if (req.user.friends.includes(friend._id)) {
      return res.status(400).json({ message: "You are already friends" });
    }

    if (friend.friendRequests.includes(req.user._id)) {
      return res.status(400).json({ message: "Friend request already sent" });
    }

    await User.findByIdAndUpdate(friend._id, { $push: { friendRequests: req.user._id } });

    res.status(200).json({ message: "Friend request sent successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const acceptFriendRequest = async (req, res) => {
  try {
    const { requesterId } = req.body;

    const me = await User.findById(req.user._id);
    
    if (!me.friendRequests.includes(requesterId)) {
      return res.status(400).json({ message: "No such friend request found" });
    }

    await User.findByIdAndUpdate(req.user._id, { 
      $pull: { friendRequests: requesterId },
      $push: { friends: requesterId }
    });

    await User.findByIdAndUpdate(requesterId, { 
      $push: { friends: req.user._id }
    });

    res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const rejectFriendRequest = async (req, res) => {
  try {
    const { requesterId } = req.body;

    await User.findByIdAndUpdate(req.user._id, { 
      $pull: { friendRequests: requesterId }
    });

    res.status(200).json({ message: "Friend request rejected" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("friends", "name email")
      .populate("friendRequests", "name email");
      
    res.status(200).json({ 
      friends: user.friends, 
      requests: user.friendRequests 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { sendFriendRequest, acceptFriendRequest, rejectFriendRequest, getFriends };
