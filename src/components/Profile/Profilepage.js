import React, { useEffect } from 'react'
import './Profilepage.css'
import assets from '../../assets/assets'
import { TiDeleteOutline } from "react-icons/ti";
import { useState } from 'react';
import { useAuth } from '../context/ContextProvider';
import { MdDeleteForever } from "react-icons/md";
import useWindow from './../hooks/useWindow';

import { FaRegEdit } from "react-icons/fa";


const Profilepage = () => {

  const [selectedUser, setSelectedUser] = useState(null)

  const { currentUser, Users, setUsers,showPopup,setShowPopup, isVisible, setIsVisible,deleteChat,showSidebar } = useAuth()

  

  useEffect(() => {
    console.log(currentUser, "selectedUser")
    const selected = Users.find((user) => user._id === currentUser)
    setSelectedUser(selected)
    console.log("seletec", selected)
  }, [currentUser])

  const handleDelete = () => {
    setIsVisible(false);
    
  };
  const device=useWindow()
  const DeleteChat=(id)=>{
    alert(id)
    deleteChat(id)

  }

  const getClass = () => {
  if (!isVisible) return "notprofilepage"; // invisible on any device

  if (device === "mobile" && showSidebar) return "notprofilepage"; // mobile sidebar open

  // visible in all other cases
  return "profilepage";
};

  return (
    <>

      <div className={getClass()}>
        <div className="delete-icon" onClick={handleDelete}><TiDeleteOutline className='icon' /></div>
        <div className="profileimage">
          <img src={selectedUser?.
            profilePic ? selectedUser.
            profilePic :
            assets.avatar_icon} alt="" />
        </div>
        <div className="profilename">
          <h2>{selectedUser?.fullName}</h2>
          <p>User Status {selectedUser?.onlineStatus ? "online" : "offline"}</p>
        </div>
        <div className="profilebio">
          <p>{selectedUser?.email}</p>
        </div>
        
        <div className="profile-menu">
          <ul>
            <li onClick={()=>setShowPopup(!showPopup)}>
              <FaRegEdit className="edit-icon" /> Edit Profile
            </li>
            <li  onClick={()=>DeleteChat(selectedUser._id)}>
              <MdDeleteForever className="edit-icon" /> Delete Chat
            </li>
          </ul>
        </div>
      </div>

    </>
  )
}

export default Profilepage
