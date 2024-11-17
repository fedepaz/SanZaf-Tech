import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  DialogContentText,
} from "@mui/material";

interface ErrorModalProps {
  open: boolean;
  onClose: () => void;
  error: {
    message: string;
    status: number;
  } | null;
  isServerDown: boolean;
}

const ErrorModal: React.FC<ErrorModalProps> = ({
  open,
  onClose,
  error,
  isServerDown,
}) => {
  if (!error) return null;
  if (isServerDown)
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Server Error</DialogTitle>
        <DialogContent>
          <DialogContentText>
            We apologize for the inconvenience. Our server is currently down.
            Please try again later.
          </DialogContentText>
          <DialogActions>
            <Button onClick={onClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    );

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Error</DialogTitle>
      <DialogContent>
        <Typography variant="body1">{error.message}</Typography>
        <DialogContentText>Status: {error.status}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ErrorModal;
