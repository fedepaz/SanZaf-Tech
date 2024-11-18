import React, { useCallback, useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { fetchAuthStatus, logout } from "../services/queries";

interface HeaderProps {
  onError: (error: any) => void;
}

const Header: React.FC<HeaderProps> = ({ onError }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const checkAuthStatus = useCallback(async () => {
    try {
      const response = await fetchAuthStatus();
      setIsLoggedIn(response.data.isLoggedIn);
    } catch (error) {
      onError(error);
      setIsLoggedIn(false);
    }
  }, [onError]);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus, location]);

  const handleLogout = async () => {
    try {
      await logout();
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
