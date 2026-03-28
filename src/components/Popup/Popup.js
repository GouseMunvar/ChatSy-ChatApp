import React, { useEffect, useState } from 'react';
import './Popup.css';
import { useAuth } from '../context/ContextProvider';

const Popup = () => {
  const { userData,setShowPopup,showPopup,updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    bio: '',
    profilePic: null,
  });

  useEffect(() => {
    if (userData) {
      setFormData({
        fullName: userData.fullName || '',
        bio: userData.bio || '',
        profilePic: null, // keep null for file upload
      });
    }
  }, [userData]);

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file upload
  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      profilePic: e.target.files[0],
    }));
  };

  // Update submit
  const handleUpdate = () => {
    updateProfile(formData)
    console.log('Updated Data:', formData);
  };

  return (
    <div className="popup">

      <input
        type="text"
        name="fullName"
        placeholder="Username"
        value={formData.fullName}
        onChange={handleChange}
      />

      <textarea
        name="bio"
        placeholder="Bio (optional)"
        rows="3"
        style={{ resize: 'none' }}
        value={formData.bio}
        onChange={handleChange}
      />

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />

      <div className="buttonContainer">

        <button onClick={handleUpdate}>
          Update
        </button>

        <button onClick={()=>setShowPopup(!showPopup)}>
          Cancel
        </button>

      </div>

    </div>
  );
};

export default Popup;