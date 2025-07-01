import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './AuthPage.css';
import Lottie from 'lottie-react';
import loginAnimation from '../animations/login-animation.json';
import loginLeftAnimation from '../animations/login-left-animation.json';


function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setErrorMsg(error.message);
    } else {
      navigate('/home');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <Lottie animationData={loginLeftAnimation} loop={true} className="lottie-left" />
      </div>

      <div className="auth-right">
        <form onSubmit={handleLogin} className="auth-form">
          <div className="lottie-center-top">
            <Lottie animationData={loginAnimation} loop={true} className="lottie-animation" />
          </div>
          <h2>Login</h2>
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
          {errorMsg && <p style={{ color: 'red', fontSize: '14px' }}>{errorMsg}</p>}
          <button type="submit" className="hover-button">Login</button>
          <p>
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
