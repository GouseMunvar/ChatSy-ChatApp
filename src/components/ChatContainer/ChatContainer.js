import React, { useEffect, useState, useRef } from 'react';
import './ChatContainer.css';
import assets from '../../assets/assets';
import { RiGalleryLine } from "react-icons/ri";
import { VscSend } from "react-icons/vsc";
import { RxInfoCircled } from "react-icons/rx";
import { useAuth } from '../context/ContextProvider';
import { socket } from '../../utils/server';
import chatImg from '../../assets/wechat.png';
import dayjs from 'dayjs';
import useWindow from '../hooks/useWindow';
import { FaArrowLeft } from "react-icons/fa";

const ChatContainer = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const device = useWindow(); // "mobile", "tablet", "laptop"
  const scroll = useRef();

  const {
    message,
    setMessage,
    userId,
    UserText,
    setUserText,
    sendMessage,
    currentUser,
    Users,
    setIsVisible,
    isVisible,
    setShowSidebar,
    showSidebar
  } = useAuth();

  const getContainerClass = () => {
    if(showSidebar && device==="mobile"){
      return "display"
    }
    if(!isVisible && device==="mobile"){
      return "mobilechatcontainer"
    }

    if(!isVisible && device==="tablet"){
      return "tabchatcontainer"
    }

    if(isVisible && device==="mobile" ){
      return "display"
      
    }
    if(isVisible && device==="tablet" ){
      return "display"
      
    }

    
    




    return "chatcontainer"
  };

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [message?.messages]);

  useEffect(() => {
    if (!userId) return;
    socket.io.opts.query = { userId };
    if (!socket.connected) socket.connect();
    socket.on("connect", () => console.log("Socket connected:", socket.id));
    socket.on("newMessage", (msg) => {
      setMessage(prev => ({ ...prev, messages: [...(prev?.messages || []), msg] }));
    });
    return () => {
      socket.off("newMessage");
      socket.off("connect");
    };
  }, [userId, setMessage]);

  useEffect(() => {
    const selected = Users?.find(user => user._id === currentUser);
    setSelectedUser(selected || null);
  }, [currentUser, Users]);

  const handleInfo = () => currentUser && setIsVisible(!isVisible);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedImage(file);
  };

  const handleSendMessage = async (e) => {
  e.preventDefault();
  if (!UserText.trim() && !selectedImage) return;

  const newMsg = {
    text: UserText,
    senderId: userId,
    receiverId: currentUser,
    createdAt: new Date().toISOString(),
    image: selectedImage ? URL.createObjectURL(selectedImage) : null
  };

  // Optimistically update chat
  setMessage(prev => ({
    ...prev,
    messages: [...(prev?.messages || []), newMsg]
  }));

  setUserText("");
  setSelectedImage(null);

  try {
    let base64Image = null;

    if (selectedImage) {
      base64Image = await fileToBase64(selectedImage); // convert to base64
    }

    const payload = {
      text: UserText,
      image: base64Image, // base64 string or null
    };

    console.log("Sending payload:", payload);

    await sendMessage(payload); // your axios call

  } catch (err) {
    console.error("Message send failed", err);
  }
};

// Helper function to convert File to base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file); // converts to base64 string
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};


  const groupedMessages = (message?.messages || []).reduce((acc, msg) => {
    const date = dayjs(msg.createdAt).format("DD MMM YYYY");
    if (!acc[date]) acc[date] = [];
    acc[date].push(msg);
    return acc;
  }, {});

  return (
    <div className={getContainerClass()}>
      {selectedUser ? (
        <>
          <div className="chatheader">
            {device === "mobile" && (
              <span className='sideArrow'>
                <FaArrowLeft onClick={() => setShowSidebar(!showSidebar)} />
              </span>
            )}
            <img src={selectedUser?.profilePic || assets.avatar_icon} alt="avatar" />
            <div className="chatheader-userinfo">
              <h3>{selectedUser?.fullName || "User"}</h3>
              <span className={`online ${selectedUser?.onlineStatus ? 'online-active' : ''}`}>
                {selectedUser?.onlineStatus ? "Online" : "Offline"}
              </span>
            </div>
            <RxInfoCircled onClick={handleInfo} className="info-icon" />
          </div>

          <div className="chatmessages">
            {Object.keys(groupedMessages).map(date => (
              <div key={date}>
                <div className='date-div'>
                  <div className="date-header">{date}</div>
                </div>
                {groupedMessages[date].map(msg => (
                  <div 
                    key={msg.createdAt}
                    className={`message ${msg.senderId === userId ? "sended" : "received"}`}
                  >
                   <div className="Imgandtext">
                     {msg.image && <img src={msg.image} alt="sent" className="chat-image" />}
                    {msg.text?<p>{msg.text.trim()}</p>:null}
                   </div>
                  </div>
                ))}
              </div>
            ))}
            <div ref={scroll}></div>
          </div>

          <form className="chatinput" onSubmit={handleSendMessage}>
            {selectedImage && (
              <div className="image-preview">
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="preview"
                  width="100"
                  style={{ borderRadius: "10px", marginBottom: "5px" }}
                />
              </div>
            )}
            <input
              type="text"
              value={UserText}
              onChange={(e) => setUserText(e.target.value)}
              placeholder="Type a message"
            />
            <input
              type="file"
              hidden
              id="fileinput"
              accept="image/*"
              onChange={handleFileChange}
            />
            <RiGalleryLine
              className="gallery-icon"
              onClick={() => document.getElementById("fileinput").click()}
            />
            <button type="submit"><VscSend /></button>
          </form>
        </>
      ) : (
        <div className="no-chat-container">
          <img src={chatImg} alt="No chat selected" className="no-chat-img" />
          <h2>Select a user to start chatting</h2>
          <p>Once you select a user from your contacts, your messages will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default ChatContainer;
