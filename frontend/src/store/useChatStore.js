import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  unreadCounts: {},
  selectedUser: null,
  isUserLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUserLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUserLoading: false });
    }
  },

  updateUserInStore: async (updatedUser) => {
    const { users, selectedUser, setSelectedUser } = get();

    const newUsers = users.map((user) =>
      user._id === updatedUser._id ? { ...user, ...updatedUser } : user
    );

    if (selectedUser?._id === updatedUser._id) {
      setSelectedUser(updatedUser);
    }

    set({
      users: newUsers,
    });
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  setUnreadCounts: (counts) => set({ unreadCounts: counts }),

  incrementUnreadCount: (userId) => {
    const prev = get().unreadCounts;
    set({
      unreadCounts: {
        ...prev,
        [userId]: (prev[userId] || 0) + 1,
      },
    });
  },

  resetUnreadCount: (userId) => {
    const prev = get().unreadCounts;
    set({
      unreadCounts: {
        ...prev,
        [userId]: 0,
      },
    });
  },

  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;

    console.log("subscribeToMessages socket'ine bağlanıldı.");

    socket.off("newMessage");
    socket.on("newMessage", (newMessage) => {
      const { selectedUser, messages } = get();

      if (newMessage.senderId === selectedUser?._id) {
        // Aktif kullanıcıdan geldiyse göster
        set({ messages: [...messages, newMessage] });
      } else {
        console.log("Başka kullanıcıdan mesaj geldi");
        get().incrementUnreadCount(newMessage.senderId);
        // Diğer kullanıcıdan geldiyse bildirim gibi göster
        // TODO: unread sayısı artıcak.
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;

    // socket.off("newMessage"); //TODO: burası yorum satırı değildi.
  },

  getUserData: async () => {
    try {
      const res = await axiosInstance.get(`/messages/data`);
      return res.data;
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  getUnread: async (userId) => {
    try {
      const res = await axiosInstance.get(`/messages/unread`);
      const data = res.data;

      const countsMap = {};
      data.forEach((item) => {
        countsMap[item._id] = item.count;
      });

      return countsMap;
    } catch (error) {
      console.log("getUnread'de hata oluştu:", error);
      toast.error(error.response);
    }
  },

  // setSelectedUser: (selectedUser) => {set({ selectedUser })},
  setSelectedUser: (user) =>
    set((state) => ({ ...state, selectedUser: user ? { ...user } : null })),
}));
