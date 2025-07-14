import { create } from "zustand";
import { io } from "socket.io-client";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useChatStore } from "./useChatStore";

const BASE_URL = "http://localhost:5001";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  friendRequests: [],
  blockedUsers: [],
  friends: [],
  socket: null,

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get("/auth/check");
      const user = res.data;

      set({ authUser: res.data, friends: res.data.friends });

      await Promise.all([
        get().getBlockedUsers(),
        get().getRequests(),
        useChatStore.getState().getUsers(),
        get().connectSocket(),
      ]);
      return user;
    } catch (error) {
      set({ authUser: null });
      console.log("useAuthStore'da hata oluştu: " + error);
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("auth/signup", data);

      set({ authUser: res.data, friends: res.data.friends });

      await Promise.all([
        get().getBlockedUsers(),
        get().getRequests(),
        useChatStore.getState().getUsers(),
        get().connectSocket(),
      ]);

      toast.success("Hesap başarıyla oluşturuldu.");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);

      set({ authUser: res.data, friends: res.data.friends });

      await Promise.all([
        get().getBlockedUsers(),
        get().getRequests(),
        useChatStore.getState().getUsers(),
        get().connectSocket(),
      ]);

      toast.success("Giriş yapıldı.");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      const res = await axiosInstance.post("/auth/logout");
      set({ authUser: null });

      toast.success("Başarıyla hesaptan çıkıldı.");
      get().disconnectSocket();

      return res.data;
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profil güncellendi.");
    } catch (error) {
      console.log("updateProfile'de hata oluştu:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },

  subscribeToFriends: () => {
    const socket = useAuthStore.getState().socket;
    console.log("subscribeToFriends socket'ine bağlanıldı.");
    socket.off("newRequest");
    socket.on("newRequest", (newReq) => {
      set({ friendRequests: [...get().friendRequests, newReq] });
      console.log(
        "Yeni arkadaş isteği geldi. useAuthStore.js/subscribeToFriends"
      );
    });

    //TODO: BURADA Bİ BOZUKLUK VAR
    socket.off("reqAnswer");
    socket.on("reqAnswer", (reqAns) => {
      console.log("Yeni arkadaş eklendi. useAuthStore.js/subscribeToFriends");

      set({ friends: [...get().friends, reqAns._id] });

      useChatStore.setState((state) => ({
        users: [...state.users, reqAns],
      }));
    });

    socket.off("removeFriend");
    socket.on("removeFriend", (user, data) => {
      console.log("Arkadaş silindi. useAuthStore.js/subscribeToFriends");

      set({ friends: get().friends.filter((u) => u != user) });
      data?.block && get().getBlockedUsers();

      useChatStore.setState((state) => ({
        users: state.users.filter((u) => u._id != user),
      }));
    });

    socket.off("userProfileUpdated");
    socket.on("userProfileUpdated", (updatedUser) => {
      if (get().friends.includes(updatedUser._id)) {
        useChatStore.getState().updateUserInStore(updatedUser);
      }
    });
  },

  unsubscribeFromFriends: () => {
    const socket = useAuthStore.getState().socket;

    socket.off("newRequest");
    socket.off("reqAnswer");
    socket.off("removeFriend");
  },

  sendRequest: async (data) => {
    try {
      const res = await axiosInstance.post(`/friends/send`, data);
      toast.success("Arkadaşlık isteği gönderildi.");

      //set({ authUser: res.data }); //SAÇMA
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  getRequests: async () => {
    try {
      const res = await axiosInstance.get(`/friends/listRequests`);

      set({ friendRequests: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  responseRequest: async (user, data) => {
    try {
      const res = await axiosInstance.post(`/friends/response/${user}`, data);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  removeFriend: async (user) => {
    try {
      const res = await axiosInstance.post(`/friends/remove/${user}`);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  blockFriend: async (user) => {
    try {
      const res = await axiosInstance.post(`/friends/block/${user}`);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  unblockFriend: async (user) => {
    try {
      const res = await axiosInstance.post(`/friends/unblock/${user}`);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  getBlockedUsers: async () => {
    try {
      const res = await axiosInstance.get(`/friends/listBlocked`);

      set({ blockedUsers: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },
}));
