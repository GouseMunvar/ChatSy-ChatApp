import logo from './logo.svg';
import Sidebar from './components/Sidebar/Sidebar';
import ChatContainer from './components/ChatContainer/ChatContainer';
import Profilepage from './components/Profile/Profilepage';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import AuthLayout from './components/sharedlayout/loginPage';
import './App.css';
import { ToastContainer, toast } from 'react-toastify';
import { socket } from './utils/server';
import { useContext } from 'react';
import React, { useEffect } from 'react'
import { useAuth } from './components/context/ContextProvider';

const  Layout = () => {
  const token = localStorage.getItem('token');
  const {onlineUsers,setOnlineUsers}=useAuth()
 

useEffect(() => {
  if (!token) {
    window.location.href = "/";
    return;
  }

  const userId = localStorage.getItem("userId");

  if (userId && !socket.connected) {
    socket.io.opts.query = { userId };
    socket.connect();
  }

  // Listen for online users
  const handleOnlineUsers = (users) => {
    setOnlineUsers(users); // replace state with the latest array from backend
    console.log("Online users updated:", users);
  };

  socket.on("online-users", handleOnlineUsers);

  return () => {
    socket.off("online-users", handleOnlineUsers); // cleanup listener
  
  };
}, [token, setOnlineUsers]);

  return (
    <div style={{width: "100%", display: "flex"}}>
      <Sidebar/>
      <ChatContainer/>
      <Profilepage/>
    </div>
  )
}



function App() {
  return (
    <Router>
    <div className="App">
     <ToastContainer />
      <Routes>
        <Route path='/' element={<AuthLayout/>}/>
        <Route path='/home' element={<Layout/>}/>
      </Routes>
    </div>
    </Router>
  );
}

export default App;

