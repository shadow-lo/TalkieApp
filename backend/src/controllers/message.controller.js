import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import { handleError } from "../lib/utils.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    // const filteredUsers = await User.find({
    //   _id: { $ne: loggedInUserId },
    // }).select("-password");

    const user = await User.findOne({ _id: loggedInUserId }).select(
      "-password"
    );

    const friendsMap = await Promise.all(
      user.friends.map(
        async (u) => await User.findOne({ _id: u }).select("-password")
      )
    );

    res.status(200).json(friendsMap);
  } catch (error) {
    handleError(res, error, "getUsersForSidebar");
  }
};

export const getData = async (req, res) => {
  try {
    const userId = req.user._id;

    // Hem gönderilen hem alınan mesajları al
    const allMessages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    }).sort({ createdAt: -1 });

    const data = [];

    for (const msg of allMessages) {
      const senderObj = await User.findOne({ _id: msg.senderId }).select("fullName");
      const receiverObj = await User.findOne({ _id: msg.receiverId }).select("fullName");

      const tempData = [];
      tempData.push(senderObj);
      tempData.push(receiverObj);
      tempData.push(msg);
      data.push(tempData);
    }

    res.status(200).json(data);
  } catch (error) {
    handleError(res, error, "getData");
  }
};


export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    await Message.updateMany(
      { senderId: userToChatId, receiverId: myId },
      { $set: { seen: true } }
    );

    res.status(200).json(messages);
  } catch (error) {
    handleError(res, error, "getMessages");
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      // Upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
      seen: false,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    handleError(res, error, "sendMessage");
  }
};

export const getUnreadMessagesCount = async (req, res) => {
  try {
    const receiverId = req.user._id;

    const counts = await Message.aggregate([
      {
        $match: {
          receiverId,
          seen: false,
        },
      },
      { $group: { _id: "$senderId", count: { $sum: 1 } } },
    ]);

    res.json(counts);
  } catch (error) {
    handleError(res, error, "getUnreadMessagesCount");
  }
};
