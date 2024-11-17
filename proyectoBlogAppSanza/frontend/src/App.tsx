import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreatePost from "./pages/CreatePost";
import useErrorHandler from "./hooks/useErrorHandler";
import ErrorModal from "./components/ErrorModal";

const theme = createTheme();

function App() {
  const { error, handleError, clearError } = useErrorHandler();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Header onError={handleError} />
        <Routes>
          <Route path="/" element={<Home onError={handleError} />} />
          <Route path="/login" element={<Login onError={handleError} />} />
          <Route
            path="/register"
            element={<Register onError={handleError} />}
          />
          <Route
            path="/create-post"
            element={<CreatePost onError={handleError} />}
          />
        </Routes>
        <ErrorModal
          open={!!error.error || error.isServerDown}
          onClose={clearError}
          error={error.error}
          isServerDown={error.isServerDown}
        />
      </Router>
    </ThemeProvider>
  );
}

export default App;
