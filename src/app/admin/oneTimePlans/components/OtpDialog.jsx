"use client";
import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    IconButton,
    Box,
    Typography
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function OtpDialog({ open, onClose, initialData = null }) {
    
    return (
        <Dialog open={!!open} onClose={onClose} fullWidth maxWidth="sm" aria-labelledby="otp-dialog">
            <DialogTitle id="otp-dialog" className="flex items-center justify-between">
                {initialData ? "Edit One-time Plan" : "Create One-time Plan"}
                <IconButton size="small" onClick={onClose} aria-label="close">
                    <CloseIcon fontSize="small" />
                </IconButton>
            </DialogTitle>

            <Box component="form" noValidate onSubmit={(e) => { e.preventDefault(); /* form to be added later */ }}>
                <DialogContent dividers>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Form to create / edit one-time plan will be implemented here.
                    </Typography>

                    {/* Show a read-only preview of initialData if present */}
                    {initialData ? (
                        <div>
                            <Typography variant="subtitle2">Plan Preview</Typography>
                            <pre style={{ whiteSpace: "pre-wrap", fontSize: 12 }}>{JSON.stringify(initialData, null, 2)}</pre>
                        </div>
                    ) : (
                        <Typography variant="body2">No data. Use the form to add a new plan (coming soon).</Typography>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button variant="contained" disabled>Save (disabled — implement form)</Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}
