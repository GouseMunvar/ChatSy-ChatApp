import React, { useEffect } from 'react';
import './Sidebar.css';
import { FaSearch } from "react-icons/fa";
import { LuLogOut } from "react-icons/lu";
import assets from '../../assets/assets';
import { useAuth } from '../context/ContextProvider';
import { useNavigate } from 'react-router-dom';
import OnlineStatusChip from '../Chip/chip';
import useWindow from '../hooks/useWindow';

const Sidebar = () => {
  const {
    getUsersForSideBar,
    unSeen,
    setUnseen,
    Users,
    setUsers,
    setToken,
    currentUser,
    setCurrentUser,
    getUserMessages,
    setShowSidebar,
    showSidebar
  } = useAuth();

  const device = useWindow(); // "mobile" | "tablet" | "laptop"
  const navigate = useNavigate();

  /* ---------------- SIDEBAR VISIBILITY LOGIC ---------------- */
  const getSidebarClass = () => {
    if (device === "mobile") {
      return showSidebar ? "sidebarfullwidth" : "display";
    }
    return "sidebar"; // tablet & laptop
  };

  /* ---------------- LOGOUT ---------------- */
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setToken(null);
    navigate('/');
  };

  /* ---------------- FETCH USERS ---------------- */
  useEffect(() => {
    const fetchUsers = async () => {
      const res = await getUsersForSideBar();
      setUsers(res.users);
      setUnseen(res.unseenMessages);
    };
    fetchUsers();
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      getUserMessages(currentUser);
    }
  }, [currentUser]);

  /* ---------------- USER CLICK ---------------- */
  const handleUserClick = (id) => {
    setCurrentUser(id);

    // On mobile, close sidebar after selecting user
    if (device === "mobile") {
      setShowSidebar(false);
    }
  };

  return (
    <div className={getSidebarClass()}>
      {/* HEADER */}
      <div className="sidebarheader">
        <h3>Welcome to Chatsy</h3>
        <img src={assets.logo} alt="Chatsy Logo" />
      </div>

      {/* SEARCH */}
      <div className="searchbar">
        <FaSearch className="searchicon" />
        <input type="text" placeholder="Search..." />
      </div>

      {/* USERS */}
      <div className="sidebarusers">
        {Users.map((user) => (
          <div className="sidebaruser" key={user._id}>
            <img
              className="avatar"
              src={user.profilePic || assets.avatar_icon}
              alt={user.fullName}
            />

            <div
              className="sidebaruser-info"
              onClick={() => handleUserClick(user._id)}
            >
              <div className="user-name-status">
                <span className="username">{user.fullName}</span>
                <OnlineStatusChip isOnline={user.onlineStatus} />
              </div>

              <div className="notification-wrapper">
                <div
                  className="notification"
                  data-count={unSeen?.[user._id] ?? 0}
                >
                  {unSeen?.[user._id] ?? 0}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <div className="sidebarfooter">
        <button onClick={handleLogout}>
          <LuLogOut /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
