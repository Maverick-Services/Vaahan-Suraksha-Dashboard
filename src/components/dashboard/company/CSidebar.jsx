'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import {
    Drawer,
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Collapse,
    Avatar,
    IconButton,
    Menu,
    MenuItem,
    Divider,
    Typography,
} from '@mui/material'
import {
    ExpandLess,
    ExpandMore,
    Dashboard as DashboardIcon,
    Settings as SettingsIcon,
    Person as PersonIcon,
    MoreVert,
    Home as HomeIcon,
    LocalOffer as BrandsIcon,
    DirectionsCar as CarIcon,
    Inventory2 as ProductIcon,
    MiscellaneousServices as ServiceIcon,
    Subscriptions as SubscriptionIcon,
    Group as UsersIcon,
    Business as CompanyIcon,
    SupervisorAccount as AdminIcon,
    Badge as EmployeeIcon,
    People as CustomerIcon,
    TwoWheeler as RiderIcon,
} from '@mui/icons-material'

import GroupIcon from '@mui/icons-material/Group'; // Members
import SubscriptionsIcon from '@mui/icons-material/Subscriptions'; // My Subscriptions
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // Profile
import LogoutButton from '@/components/auth/LogoutButton'

const drawerWidth = 260

export default function CSidebar({ variant = 'permanent', open = true, onClose }) {
    const router = useRouter();
    const pathname = usePathname() || '/'
    const [openMenus, setOpenMenus] = useState({})
    const [anchorEl, setAnchorEl] = useState(null)
    const isMenuOpen = Boolean(anchorEl)

    const sections = [
        { label: 'Dashboard', icon: <DashboardIcon />, path: '/company' },
        { label: 'Members', icon: <GroupIcon />, path: '/company/members' },
        { label: 'My Subscriptions', icon: <SubscriptionsIcon />, path: '/company/mySubscriptions' },
        // { label: 'Profile', icon: <AccountCircleIcon />, path: '/company/profile' }
        // {
        //     label: 'Users',
        //     icon: <UsersIcon />,
        //     expandable: true,
        //     children: [
        //         { label: 'Admins', path: '/admin/users/admins', icon: <AdminIcon fontSize="small" /> },
        //         { label: 'Employees', path: '/admin/users/employees', icon: <EmployeeIcon fontSize="small" /> },
        //         { label: 'Customers', path: '/admin/users/customers', icon: <CustomerIcon fontSize="small" /> },
        //         { label: 'Riders', path: '/admin/users/riders', icon: <RiderIcon fontSize="small" /> },
        //         { label: 'Companies', path: '/admin/users/companies', icon: <CompanyIcon fontSize="small" /> },
        //     ],
        // },,
        // { label: 'Products', icon: <ProductIcon />, path: '/admin/products' },
        // { label: 'Services', icon: <ServiceIcon />, path: '/admin/services' },
    ]

    useEffect(() => {
        const newOpen = {}
        sections.forEach((it) => {
            if (it.expandable && it.children) {
                const match = it.children.some((ch) => pathname === ch.path || pathname.startsWith(ch.path))
                if (match) newOpen[it.label] = true
            }
        })
        setOpenMenus((prev) => ({ ...prev, ...newOpen }))
    }, [pathname])

    const toggleSubMenu = (label) => {
        setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }))
    }

    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget)
    const handleMenuClose = () => setAnchorEl(null)

    const isActivePath = (path) => {
        if (!path) return false;

        // Exact match for /company
        if (path === '/company') {
            return pathname === '/company';
        }

        // Normal check for other paths
        return pathname === path || pathname.startsWith(path + '/');

    };

    return (
        <Drawer
            variant={variant}
            open={open}
            onClose={onClose}
            className='scrollbar-hide'
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    bgcolor: '#fff',
                    borderRight: '1px solid rgba(0,0,0,0.08)',
                    paddingX: 1.5, // padding from border
                    overflowY: 'auto',
                },
            }}
            slotProps={{
                paper: {
                    className: 'scrollbar-hide', // ✅ hide scrollbar
                },
            }}
        >
            <Box>
                {/* Logo */}
                <Box p={2} display="flex" justifyContent="center" alignItems="center">
                    <Link href="/admin">
                        <Image src="/LogoCompany.png" alt="Logo" width={250} height={88} style={{ objectFit: 'contain' }} />
                    </Link>
                </Box>

                <Divider />

                {/* Navigation */}
                <List
                    disablePadding
                    sx={{
                        marginTop: 2,
                    }}
                >
                    {sections.map(({ label, path, icon, expandable, children }) => {
                        if (expandable) {
                            const childActive = children.some((c) => isActivePath(c.path))
                            return (
                                <Box key={label}>
                                    <ListItem disablePadding>
                                        <ListItemButton
                                            onClick={() => toggleSubMenu(label)}
                                            selected={!!openMenus[label] || childActive}
                                            sx={{
                                                borderRadius: 1,
                                                mx: 0.5,
                                                my: 0.3,
                                                gap: 1, // icon closer to text
                                                '&.Mui-selected': {
                                                    backgroundColor: 'rgba(0,0,0,0.06)',
                                                    color: 'inherit',
                                                },
                                                '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' },
                                            }}
                                        >
                                            {icon && (
                                                <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>
                                                    {React.cloneElement(icon, { fontSize: 'small' })}
                                                </ListItemIcon>
                                            )}
                                            <ListItemText primary={label} />
                                            {openMenus[label] ? <ExpandLess /> : <ExpandMore />}
                                        </ListItemButton>
                                    </ListItem>

                                    <Collapse in={!!openMenus[label] || childActive} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>
                                            {children.map((child) => {
                                                const selected = isActivePath(child.path)
                                                return (
                                                    <ListItem key={child.label} disablePadding>
                                                        <ListItemButton
                                                            component={Link}
                                                            href={child.path}
                                                            selected={selected}
                                                            sx={{
                                                                pl: 4.5,
                                                                borderRadius: 1,
                                                                mx: 0.5,
                                                                my: 0.2,
                                                                gap: 1,
                                                                '&.Mui-selected': {
                                                                    backgroundColor: 'rgba(0,0,0,0.1)',
                                                                    color: 'inherit',
                                                                },
                                                                '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' },
                                                            }}
                                                        >
                                                            <ListItemIcon sx={{ color: 'text.primary', minWidth: 22 }}>
                                                                {React.cloneElement(child.icon || <CircleIcon />, { fontSize: 'small' })}
                                                            </ListItemIcon>
                                                            <ListItemText primary={child.label} />
                                                        </ListItemButton>
                                                    </ListItem>
                                                )
                                            })}
                                        </List>
                                    </Collapse>
                                </Box>
                            )
                        }

                        const selected = isActivePath(path)
                        return (
                            <ListItem key={label} disablePadding>
                                <ListItemButton
                                    component={Link}
                                    href={path}
                                    selected={selected}
                                    sx={{
                                        borderRadius: 1,
                                        mx: 0.5,
                                        my: 0.3,
                                        gap: 1, // icon closer to text
                                        '&.Mui-selected': {
                                            backgroundColor: 'rgba(0,0,0,0.06)',
                                            color: 'inherit',
                                        },
                                        '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' },
                                    }}
                                >
                                    {icon && (
                                        <ListItemIcon sx={{ color: 'inherit', minWidth: 18 }}>
                                            {React.cloneElement(icon, { fontSize: '15' })}
                                        </ListItemIcon>
                                    )}
                                    <ListItemText primary={label} />
                                </ListItemButton>
                            </ListItem>
                        )
                    })}
                </List>
            </Box>

            {/* Profile Section */}
            <Box p={2} sx={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box display="flex" alignItems="center">
                        <Avatar src="/profile.jpg" alt="User" sx={{ width: 42, height: 42, mr: 1 }} />
                        <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>Company</Typography>
                            <Typography variant="caption" color="text.secondary">
                                company@vaahan.com
                            </Typography>
                        </Box>
                    </Box>
                    <IconButton onClick={handleMenuOpen} aria-label="Profile options" size="small">
                        <MoreVert />
                    </IconButton>
                </Box>

                <Menu
                    anchorEl={anchorEl}
                    open={isMenuOpen}
                    onClose={handleMenuClose}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                    <MenuItem>
                        <LogoutButton />
                    </MenuItem>
                </Menu>
            </Box>
        </Drawer>
    )
}
