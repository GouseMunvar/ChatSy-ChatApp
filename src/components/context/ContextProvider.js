import React, { createContext,useContext, useState } from 'react';
import axios from 'axios';
import { socket } from '../../utils/server';

// Create a context
export const AuthContext = createContext();

const ContextProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [message,setMessage]=useState([])
  const [currentUser,setCurrentUser]=useState(null)
  const [userId,setUserId]=useState(localStorage.getItem('userId') || null)
  const [UserText,setUserText]=useState("")
  const [onlineUsers,setOnlineUsers]=useState([])
   const [Users, setUsers] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
   const [unSeen,setUnseen]=useState({})
   const [showSidebar,setShowSidebar]=useState(true)

  // Signup function
  const Signup = async (email, fullName, password, bio = '', profilePic = '') => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', {
        email,
        fullName,
        password,
        bio,
        profilePic,
      });

      const { token } = response.data;
      setToken(token);
      localStorage.setItem('token', token);
      return true
    } catch (error) {
     
      console.error('Error signing up:', error);
       return false
  }


  


  
  };

 const Login = async (email, password) => {
  try {
    const response = await axios.post("http://localhost:5000/api/auth/login", {
      email,
      password,
    });

    const { token, user } = response.data;
    console.log(response.data, "login response");
    if (!token) throw new Error("Invalid login credentials");

    // Store in localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("userId", user.id);
    setUserId(user.id);
    setToken(token);

    // Update socket query and connect
    
   socket.io.opts.query = { userId: user.id }; // dynamically set after login
    socket.connect();
    
    return true;
  } catch (error) {
    console.error("❌ Error logging in:", error);
    return false;
  }
};

const getUserMessages=async(userId)=>{

  try{
    const response=await axios.get(`http://localhost:5000/api/messages/messages/${currentUser}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setMessage(response.data);
  } catch (error) {
    console.error('Error fetching user messages:', error);
    return [];
  }
}

const sendMessage = async (payload) => {
  try {
    const response = await axios.post(
      `http://localhost:5000/api/messages/send/${currentUser}`,
       payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    return null;
  }
}



const deleteChat = async (otherUserId) => {
  try {
    await axios.delete(
      `http://localhost:5000/api/messages/deleteChat/${otherUserId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Clear messages locally
    setMessage({ messages: [] });

    // Reset unseen count
    setUnseen(prev => ({
      ...prev,
      [otherUserId]: 0
    }));

    // Optional: reset selected user
    setCurrentUser(null);

    return true;
  } catch (error) {
    console.error("❌ Error deleting chat:", error);
    return false;
  }
};





  const getUsersForSideBar=async()=>{
    try{
      const response=await axios.get('http://localhost:5000/api/messages/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error){
        
        console.error('Error fetching users:', error);
      }
    }
  return (
    <AuthContext.Provider value={{deleteChat,showSidebar,setShowSidebar,unSeen,setUnseen,isVisible,setIsVisible,Users,setUsers,onlineUsers,setOnlineUsers, token, setToken,UserText,setUserText, Login,getUsersForSideBar,getUserMessages,message,userId,setMessage,currentUser,setCurrentUser,sendMessage }}>
      {children}
    </AuthContext.Provider>
  );
};


export default ContextProvider;

export const useAuth = () => useContext(AuthContext);
