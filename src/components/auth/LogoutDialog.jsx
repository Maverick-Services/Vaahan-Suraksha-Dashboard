"use client"
import React, { useState } from 'react'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Button } from '@mui/material'
import { useAuthStore } from '@/stores/useAuthStore';

export default function LogoutDialog({ open, onClose }) {

    const { clearAuth } = useAuthStore();
    const [loading, setLoading] = useState(false)

    function handleLogout() {
        setLoading(true)
        setTimeout(() => {
            clearAuth() // clear user from local storage
            setLoading(false)
            onClose() // close dialog after logout
        }, 500) // simulate delay
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="alert-dialog-logout"
            aria-describedby="alert-dialog-logout"
        >
            <DialogTitle id="alert-dialog-logout">
                {"Logout"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-logout">
                    Do you want to log out?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    onClick={handleLogout}
                    autoFocus
                    variant="contained"
                    loading={loading}
                >
                    Logout
                </Button>
            </DialogActions>
        </Dialog>
    )
}