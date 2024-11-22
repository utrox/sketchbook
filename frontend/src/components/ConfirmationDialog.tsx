import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

interface ConfirmationDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationDialog = ({
  open,
  title,
  message,
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) => {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onConfirm} color="primary">
          Confirm
        </Button>
        <Button onClick={onCancel} color="error">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
