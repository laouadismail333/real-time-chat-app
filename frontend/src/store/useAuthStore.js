import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from 'socket.io-client'

const BASE_URL = 'http://localhost:3000'

export const useAuthStore = create((set,get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers:[],
  socket:null,

  // ✅ Check authentication
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket()
    } catch (error) {
      console.log(`Error in checkAuth: ${error.message}`);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // ✅ Sign up
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
      // Remove or uncomment if you have a socket connection:
      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      set({ isSigningUp: false });
    }
  },
  // ✅ login
  login: async (data) => {  
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");

      // Remove or uncomment if you have a socket connection:
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },
  // ✅ logout
  logout: async ()=>{
    try {
      await axiosInstance.post('/auth/logout')
       set({ authUser: null });
      toast.success("Logged out successfully");
      // Remove or uncomment if you have a socket connection:
      get().disconnectSocket()
    } catch (error) {
       toast.error(error.response.data.message);
    }
  },
  // ✅ Profile
updateProfile: async (data) => {
  set({ isUpdatingProfile: true });
  try {
    // optimistic update (optional)
    set({ authUser: { ...get().authUser, ...data } });

    const res = await axiosInstance.put("/auth/update-profile", data);
    set({ authUser: res.data });
    toast.success("Profile updated successfully");
  } catch (error) {
    console.log("Error updating profile:", error);
    toast.error(error.response?.data?.message || "Failed to update profile");
  } finally {
    set({ isUpdatingProfile: false });
  }
},
  connectSocket:()=>{
    const {authUser} = get()
    if (!authUser || get().socket?.connected) return
    const socket = io(BASE_URL, {
    query:{
      userId: authUser._id
    },
    withCredentials: true
    })

    socket.connect()
    
    set({socket:socket})

    socket.on('getOnlineUsers', (usersIds)=>{
      set({ onlineUsers: usersIds })
    })
  },
  disconnectSocket:()=>{
    if (get().socket?.connected) get().socket.disconnect()
  }
}));
