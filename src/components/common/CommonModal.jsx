import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
} from "@mui/material";
import { AiOutlineClose } from "react-icons/ai";

const CommonModal = ({
  open,
  onClose,
  title,
  children,
  actions = [], // array of { label, onClick, variant, color }
  showCloseButton = true,
  maxWidth = "sm",
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth={maxWidth} fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>{title}</div>
        {showCloseButton && (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{ color: (theme) => theme.palette.grey[500] }}
          >
            <AiOutlineClose size={20} />
          </IconButton>
        )}
      </DialogTitle>

      <DialogContent dividers>{children}</DialogContent>

      {actions.length > 0 && (
        <DialogActions>
          {actions.map((action, index) => (
            <Button
              key={index}
              onClick={action.onClick}
              variant={action.variant || "contained"}
              color={action.color || "primary"}
            >
              {action.label}
            </Button>
          ))}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default CommonModal;
