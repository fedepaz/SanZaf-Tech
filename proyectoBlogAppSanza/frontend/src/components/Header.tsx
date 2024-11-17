import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

interface HeaderProps {
  onError: (error: any) => void;
}

const Header: React.FC<HeaderProps> = ({ onError }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkAuthStatus();
  }, [location]);

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/auth/status",
        { withCredentials: true }
      );
      setIsLoggedIn(response.data.isLoggedIn);
    } catch (error) {
      onError(error);
      setIsLoggedIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        { withCredentials: true }
      );
      setIsLoggedIn(false);

      window.location.reload();
      window.location.href = "/";

      navigate("/");
    } catch (error) {
      console.error("Logout failed");
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Blog App
        </Typography>
        <Button color="inherit" component={Link} to="/">
          Home
        </Button>
        {isLoggedIn ? (
          <>
            {location.pathname !== "/create-post" && (
              <Button color="inherit" component={Link} to="/create-post">
                Create Post
              </Button>
            )}
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button color="inherit" component={Link} to="/register">
              Register
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
