import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/'); // redirect to login
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) return <p>Loading...</p>;

  return children;
}

export default ProtectedRoute;
