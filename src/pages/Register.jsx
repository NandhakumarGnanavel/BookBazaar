import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './AuthPage.css';
import Lottie from 'lottie-react';
import loginAnimation from '../animations/login-animation.json';
import loginLeftAnimation from '../animations/login-left-animation.json';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setErrorMsg('Passwords do not match');
      return;
    }

    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setErrorMsg(error.message);
    } else {
      alert('Registration successful! Please log in.');
      navigate('/');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <Lottie animationData={loginLeftAnimation} loop={true} className="lottie-left" />
      </div>

      <div className="auth-right">
        <form onSubmit={handleRegister} className="auth-form">
          <div className="lottie-center-top">
            <Lottie animationData={loginAnimation} loop={true} className="lottie-animation" />
          </div>
          <h2>Create Account</h2>
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            onChange={(e) => setConfirm(e.target.value)}
            required
          />

          {errorMsg && <p style={{ color: 'red', fontSize: '14px' }}>{errorMsg}</p>}

          <button type="submit" className="hover-button">Register</button>
          <p>
            Already have an account? <Link to="/">Login here</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;

