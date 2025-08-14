'use client'

import { AppBar, Toolbar, IconButton, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'

export default function CNavbar({ onDrawerToggle, title = 'Admin Dashboard' }) {
    return (
        <AppBar
            position="fixed"
            color="primary"
            elevation={0}
            sx={{
                display: { md: 'none' },
                zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
        >
            <Toolbar>
                <IconButton
                    edge="start"
                    color="inherit"
                    onClick={onDrawerToggle}
                    sx={{ mr: 2 }}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" noWrap component="div">
                    {title}
                </Typography>
            </Toolbar>
        </AppBar>
    )
}
