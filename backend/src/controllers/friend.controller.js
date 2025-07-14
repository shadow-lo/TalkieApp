import { getReceiverSocketId, io } from "../lib/socket.js";
import User from "../models/user.model.js";
import { handleError } from "../lib/utils.js";

export const sendRequest = async (req, res) => {
  try {
    const { email } = req.body;
    const loggedInUserId = req.user._id;

    if (!email) return res.status(400).json({ message: "Email not found." });

    const receiverObject = await User.findOne({ email }).select("_id");
    if (!receiverObject)
      return res.status(400).json({ message: "User not found." });

    const receiverId = receiverObject._id;
    if (receiverId.equals(loggedInUserId))
      return res
        .status(400)
        .json({ message: "You can't send request to yourself." });

    const checkReceiver = await User.findById(receiverId).select(
      "friendRequests friends blockedUsers"
    );

    if (
      checkReceiver.friends.includes(loggedInUserId) ||
      checkReceiver.friendRequests.includes(loggedInUserId) ||
      checkReceiver.blockedUsers.includes(loggedInUserId)
    )
      return res.status(400).json({ message: "You can't do this right now." });

    const loggedInUserObject = await User.findById(loggedInUserId).select(
      "-password"
    );

    let receiver;

    if (loggedInUserObject.friendRequests.includes(receiverId)) {
      await User.findByIdAndUpdate(
        loggedInUserId,
        {
          $pull: { friendRequests: receiverId },
          $push: { friends: receiverId },
        },
        { new: true }
      ).select("-password");

      receiver = await User.findByIdAndUpdate(
        receiverId,
        {
          $push: { friends: loggedInUserId },
        },
        { new: true }
      ).select("-password");
    } else {
      receiver = await User.findByIdAndUpdate(
        receiverId,
        {
          $push: { friendRequests: loggedInUserId },
        },
        { new: true }
      ).select("-password");
    }

    //TODO: BURASI ÇOK KARIŞIK

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newRequest", loggedInUserObject);
    }

    res.status(201).json(receiver);
  } catch (error) {
    handleError(res, error, "sendRequest");
  }
};

export const responseRequest = async (req, res) => {
  try {
    const { response } = req.body;
    const { id: requestId } = req.params;
    const loggedInUserId = req.user._id;

    if (response == null) {
      return res.status(400).json({ message: "Response is required." });
    }

    const checkReceiver = await User.findById(loggedInUserId).select(
      "friendRequests"
    );

    if (!checkReceiver.friendRequests.includes(requestId))
      return res.status(400).json({ message: "Can't find the request." });

    let receiver;
    let logged;

    if (response === false) {
      receiver = await User.findByIdAndUpdate(
        loggedInUserId,
        {
          $pull: { friendRequests: requestId },
        },
        { new: true }
      ).select("-password");
    } else if (response === true) {
      receiver = await User.findByIdAndUpdate(
        loggedInUserId,
        {
          $pull: { friendRequests: requestId },
          $push: { friends: requestId },
        },
        { new: true }
      ).select("-password");

      logged = await User.findByIdAndUpdate(
        requestId,
        {
          $push: { friends: loggedInUserId },
        },
        { new: true }
      ).select("-password");

      const loggedInSocketId = getReceiverSocketId(loggedInUserId);
      io.to(loggedInSocketId).emit("reqAnswer", logged);

      const receiverSocketId = getReceiverSocketId(requestId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("reqAnswer", receiver);
      }
    }

    res.status(201).json(checkReceiver.friendRequests);
  } catch (error) {
    handleError(res, error, "responseRequest");
  }
};

export const removeFriend = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const loggedInUserId = req.user._id;

    const checkLogged = await User.findById(loggedInUserId).select("friends");
    if (!checkLogged.friends.includes(receiverId))
      return res
        .status(400)
        .json({ message: "You don't have friend with this id." });

    const loggedInUserObject = await User.findByIdAndUpdate(
      loggedInUserId,
      {
        $pull: { friends: receiverId },
      },
      { new: true }
    ).select("-password");

    await User.findByIdAndUpdate(
      receiverId,
      {
        $pull: { friends: loggedInUserId },
      },
      { new: true }
    ).select("-password");

    const loggedInSocketId = getReceiverSocketId(loggedInUserId);
    io.to(loggedInSocketId).emit("removeFriend", receiverId);

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("removeFriend", loggedInUserId);
    }

    res.status(201).json(loggedInUserObject);
  } catch (error) {
    handleError(res, error, "removeFriend");
  }
};

export const blockFriend = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const loggedInUserId = req.user._id;

    const checkLogged = await User.findById(loggedInUserId).select("friends");
    if (!checkLogged.friends.includes(receiverId))
      return res
        .status(400)
        .json({ message: "You don't have friend with this id." });

    const loggedInUserObject = await User.findByIdAndUpdate(
      loggedInUserId,
      {
        $pull: { friends: receiverId },
        $push: { blockedUsers: receiverId },
      },
      { new: true }
    ).select("-password");

    await User.findByIdAndUpdate(
      receiverId,
      {
        $pull: { friends: loggedInUserId },
      },
      { new: true }
    ).select("-password");

    const loggedInSocketId = getReceiverSocketId(loggedInUserId);
    io.to(loggedInSocketId).emit("removeFriend", receiverId, { block: true });

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("removeFriend", loggedInUserId);
    }

    res.status(201).json(loggedInUserObject);
  } catch (error) {
    handleError(res, error, "blockFriend");
  }
};

export const unblockFriend = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const loggedInUserId = req.user._id;

    const checkLogged = await User.findById(loggedInUserId).select(
      "blockedUsers"
    );
    if (!checkLogged.blockedUsers.includes(receiverId))
      return res
        .status(400)
        .json({ message: "You don't have blocked user with this id." });

    const loggedInUserObject = await User.findByIdAndUpdate(
      loggedInUserId,
      {
        $pull: { blockedUsers: receiverId },
      },
      { new: true }
    ).select("-password");

    res.status(201).json(loggedInUserObject);
  } catch (error) {
    handleError(res, error, "unblockFriend");
  }
};

export const listRequests = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const user = await User.findById(loggedInUserId).select("friendRequests");

    const requestsMap = await Promise.all(
      user.friendRequests.map(
        async (u) => await User.findOne({ _id: u }).select("-password")
      )
    );

    res.status(200).json(requestsMap);
  } catch (error) {
    handleError(res, error, "listRequests");
  }
};

export const listBlocked = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const user = await User.findById(loggedInUserId).select("blockedUsers");

    const blockedMap = await Promise.all(
      user.blockedUsers.map(
        async (u) => await User.findOne({ _id: u }).select("-password")
      )
    );

    res.status(200).json(blockedMap);
  } catch (error) {
    handleError(res, error, "listBlocked");
  }
};
