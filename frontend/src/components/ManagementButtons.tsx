import { useState } from "react";

import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ConfirmationDialog from "./ConfirmationDialog";

interface ManagementButtonsProps {
  entityType: string;
  onEdit: () => void;
  onDelete: () => void;
}

const ManagementButtons = ({
  onEdit,
  onDelete,
  entityType,
}: ManagementButtonsProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  return (
    <div className="management-btns" style={{ marginLeft: "auto" }}>
      <IconButton aria-label="Edit" onClick={onEdit}>
        <EditIcon />
      </IconButton>
      <IconButton
        color="error"
        aria-label="Delete"
        onClick={() => setDeleteDialogOpen(true)}
      >
        <DeleteIcon />
      </IconButton>
      <ConfirmationDialog
        open={deleteDialogOpen}
        title={`Delete ${entityType}`}
        message={`Are you sure you want to delete the ${entityType}?`}
        onConfirm={() => {
          onDelete();
          setDeleteDialogOpen(false);
        }}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </div>
  );
};

export default ManagementButtons;
