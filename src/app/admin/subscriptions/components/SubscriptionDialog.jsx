"use client";
import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

export default function SubscriptionDialog({ open, onClose, initialData = null }) {
    // Blank dialog shell — you will add the form fields later
    return (
        <Dialog open={!!open} onClose={onClose} fullWidth maxWidth="sm" aria-labelledby="subscription-dialog">
            <DialogTitle id="subscription-dialog" className="flex items-center justify-between">
                {initialData ? "Edit Subscription" : "Create New Subscription"}
                <IconButton size="small" onClick={onClose} aria-label="close">
                    <CloseIcon fontSize="small" />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                {/* Blank area — add form fields here later */}
                <div style={{ minHeight: 180 }} />
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="contained" onClick={onClose}>Save</Button>
            </DialogActions>
        </Dialog>
    );
}
