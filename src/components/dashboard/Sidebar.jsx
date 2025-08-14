// Sidebar.jsx
'use client'

import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Collapse,
    Avatar,
    IconButton,
    Menu,
    MenuItem,
    Divider,
    Typography,
    Box,
} from '@mui/material'
import {
    ExpandLess,
    ExpandMore,
    Dashboard,
    Settings,
    Logout,
    Person,
    MoreVert,
    Home,
    Info,
    ContactMail,
    ShoppingCart,
    BarChart,
} from '@mui/icons-material'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import LogoutButton from '../auth/LogoutButton'

const drawerWidth = 260

export default function Sidebar({ variant = 'permanent', open = true, onClose }) {
    const [openMenus, setOpenMenus] = useState({})
    const [anchorEl, setAnchorEl] = useState(null)
    const isMenuOpen = Boolean(anchorEl)

    const toggleSubMenu = (label) => {
        setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }))
    }

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleMenuClose = () => {
        setAnchorEl(null)
    }

    const sections = [
        {
            title: 'Dashboard',
            items: [
                { label: 'Main Dashboard', icon: <Dashboard />, path: '/admin' },
            ],
        },
        {
            title: 'Website',
            items: [
                {
                    label: 'Content',
                    icon: <Home />,
                    expandable: true,
                    children: [
                        { label: 'Home', path: '/admin/content/home' },
                        { label: 'About', path: '/admin/content/about' },
                        { label: 'Contact', path: '/admin/content/contact' },
                    ],
                },
                { label: 'Products', icon: <ShoppingCart />, path: '/admin/products' },
                { label: 'Analytics', icon: <BarChart />, path: '/admin/analytics' },
            ],
        },
        {
            title: 'Settings',
            items: [
                { label: 'Settings', icon: <Settings />, path: '/admin/settings' },
            ],
        },
    ]

    return (
        <Drawer
            variant={variant}
            open={open}
            onClose={onClose}
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                },
            }}
        >
            <div>
                <Box p={2} textAlign="center">
                    <Image
                        src="/mainLogo.avif"
                        alt="Logo"
                        width={120}
                        height={40}
                        style={{ objectFit: 'contain', margin: '0 auto' }}
                    />
                </Box>
                <Divider />

                <List>
                    {sections.map(({ title, items }) => (
                        <div key={title}>
                            <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: 'gray' }}>
                                {title}
                            </Typography>
                            {items.map(({ label, path, icon, expandable, children }) => (
                                <div key={label}>
                                    {expandable ? (
                                        <>
                                            <ListItem button onClick={() => toggleSubMenu(label)}>
                                                {icon && <ListItemIcon>{icon}</ListItemIcon>}
                                                <ListItemText primary={label} />
                                                {openMenus[label] ? <ExpandLess /> : <ExpandMore />}
                                            </ListItem>
                                            <Collapse in={openMenus[label]} timeout="auto" unmountOnExit>
                                                <List component="div" disablePadding>
                                                    {children.map((child) => (
                                                        <Link href={child.path} key={child.label} passHref>
                                                            <ListItem button sx={{ pl: 4 }} component="a">
                                                                <ListItemText primary={child.label} />
                                                            </ListItem>
                                                        </Link>
                                                    ))}
                                                </List>
                                            </Collapse>
                                        </>
                                    ) : (
                                        <Link href={path} passHref>
                                            <ListItem button>
                                                {icon && <ListItemIcon>{icon}</ListItemIcon>}
                                                <ListItemText primary={label} />
                                            </ListItem>
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                </List>
            </div>

            {/* Profile Section */}
            <Box p={2}>
                <Divider sx={{ mb: 1 }} />
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box display="flex" alignItems="center">
                        <Avatar src="/profile.jpg" alt="User" sx={{ width: 40, height: 40, mr: 1 }} />
                        <Box>
                            <Typography variant="body2">Tushar Verma</Typography>
                            <Typography variant="caption" color="text.secondary">
                                tushar@vaahan.com
                            </Typography>
                        </Box>
                    </Box>
                    <IconButton onClick={handleMenuOpen}>
                        <MoreVert />
                    </IconButton>
                </Box>

                <Menu
                    anchorEl={anchorEl}
                    open={isMenuOpen}
                    onClose={handleMenuClose}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                >
                    <MenuItem onClick={handleMenuClose}>
                        <Person sx={{ mr: 1 }} fontSize="small" /> My Profile
                    </MenuItem>
                    <MenuItem>
                        <LogoutButton />
                    </MenuItem>
                </Menu>
            </Box>
        </Drawer>
    )
}
