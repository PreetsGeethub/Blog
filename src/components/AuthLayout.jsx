import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export default function Protected({ children, Authentication = true }) {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const authStatus = useSelector((state) => state.auth.status);

  useEffect(() => {
    // If route is protected and user not logged in → redirect to login
    if (Authentication && !authStatus) {
      navigate("/login");
    }
    // If route is public and user already logged in → redirect to home
    else if (!Authentication && authStatus) {
      navigate("/");
    }

    setLoader(false);
  }, [authStatus, navigate, Authentication]);

  return loader ? <h1>Loading...</h1> : <>{children}</>;
}
