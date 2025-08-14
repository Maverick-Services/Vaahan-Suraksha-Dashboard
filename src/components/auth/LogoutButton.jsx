"use client"

import { Button } from '@mui/material'
import React, { useState } from 'react'
import LogoutDialog from './LogoutDialog'

function LogoutButton() {
    const [open, setOpen] = useState(false)

    const handleOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    return (
        <>
            <Button
                variant="contained"
                onClick={handleOpen}
            >
                Logout
            </Button>
            <LogoutDialog
                open={open}
                onClose={handleClose}
            />
        </>
    )
}

export default LogoutButton