"use client"
import React, { useState } from 'react'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Button } from '@mui/material'

function BrandModel({ open, onClose }) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="dialog-brand"
            aria-describedby="dialog-brand"
        >
            <DialogTitle id="dialog-brand">
                {"Add New Brand"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="dialog-brand">
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
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default BrandModel