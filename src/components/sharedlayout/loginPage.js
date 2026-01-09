import React, { useState } from 'react';
import './AuthLayout.css';
import chatImg from './../../assets/wechat.png'; // your image
import {useAuth} from '../context/ContextProvider';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { socket } from '../../utils/server';

const AuthLayout = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email,setemail]=useState("");
  const [password,setpassword]=useState("");
  const [username,setusername]=useState("");
  const [bio,setbio]=useState("");
  const [profilePic,setprofilePic]=useState(null);
  const { Signup,Login } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async() => {
    const success = await Signup(email, username, password, bio, profilePic);
    if (success) {
      toast.success('Signup successful! Please log in.');
     
    } else {
      toast.error('Signup failed');
    }
  };

  const handleLogin = async () => {
  const success = await Login(email, password);
  if (success) {
    navigate('/home');
    // socket.io.opts.query = { userId: localStorage.getItem("userId") }; // dynamically set after login
    // socket.connect();
  }
  else{
    toast.error('Invalid email or password');

  }
};

  return (
    <div className="auth-container">
      {/* Left Side */}
      <div className="auth-left">
        <img src={chatImg} alt="Chat Illustration" />
        <h2>Connect & Chat Effortlessly</h2>
        <p>Welcome to ChatZone — where conversations come alive!</p>
      </div>

      {/* Right Side */}
      <div className="auth-right">
        {isLogin ? (
          <div className="auth-box">
            <h2>Login</h2>
            <input value={email} onChange={(e) => setemail(e.target.value)} type="email" placeholder="Email" />
            <input value={password} onChange={(e) => setpassword(e.target.value)} type="password" placeholder="Password" />
            <button onClick={handleLogin}>Login</button>
            <p>
              Don’t have an account?{' '}
              <span onClick={() => setIsLogin(false)}>Sign up</span>
            </p>
          </div>
        ) : (
          <div className="auth-box">
            <h2>Sign Up</h2>
            <input value={username} onChange={(e) => setusername(e.target.value)} type="text" placeholder="Username" />
            <input value={email} onChange={(e) => setemail(e.target.value)} type="email" placeholder="Email" />
            <input value={password} onChange={(e) => setpassword(e.target.value)} type="password" placeholder="Password" />
            <textarea
              value={bio}
              onChange={(e) => setbio(e.target.value)}
              placeholder="Bio (optional)"
              rows="3"
              style={{ resize: 'none' }}
            />
            <input type="file" accept="image/*" onChange={(e) => setprofilePic(e.target.files[0])} />
            <button onClick={handleSignup}>Sign Up</button>
            <p>
              Already have an account?{' '}
              <span onClick={() => setIsLogin(true)}>Login</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthLayout;
