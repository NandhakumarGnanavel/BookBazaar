// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './Profile.css';

const Profile = () => {
  const [userInfo, setUserInfo] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserInfo({
          name: user.user_metadata?.name || '',
          email: user.email,
          phone: user.user_metadata?.phone || ''
        });
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  return (
    <div className="profile-box">
      <h2>Profile Info</h2>
      <input value={userInfo.name} onChange={e => setUserInfo({ ...userInfo, name: e.target.value })} />
      <input value={userInfo.email} readOnly />
      <input value={userInfo.phone} onChange={e => setUserInfo({ ...userInfo, phone: e.target.value })} />
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Profile;
