"use client";
import React, { useState } from "react";
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, IconButton, Menu, MenuItem,
    TablePagination,
    Chip
} from "@mui/material";
import Switch from "@mui/material/Switch";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Image from "next/image";

export default function SubscriptionsTable({ apiData, onPageChange }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [menuRow, setMenuRow] = useState(null);

    const handleMenuOpen = (event, row) => {
        setAnchorEl(event.currentTarget);
        setMenuRow(row);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setMenuRow(null);
    };

    console.log(apiData)

    return (
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>Sr No</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Subscribers</TableCell>
                            <TableCell>Duration</TableCell>
                            <TableCell>Service Limit</TableCell>
                            <TableCell>Active</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {apiData?.subscriptions?.map((s, index) => (
                            <TableRow hover key={s?._id}>
                                <TableCell>{(apiData?.pagination.page - 1) * apiData?.pagination.limit + index + 1}</TableCell>
                                <TableCell>{s?.name}</TableCell>
                                <TableCell>{s?.currentSubscribers?.length}</TableCell>
                                <TableCell>{s?.duration} {s?.durationUnit}</TableCell>
                                <TableCell>{s?.limit}</TableCell>
                                <TableCell>
                                    <Switch
                                        checked={s?.active}
                                        onChange={(e) => {
                                            console.log("Toggled", s?._id, e.target.checked);
                                            // you can call an API here to update status
                                        }}
                                        color="primary"
                                    />
                                </TableCell>

                                {/* <TableCell>
                                    <div className="flex flex-wrap max-w-80 gap-1">
                                        {s?.car_models?.map((cm, idx) => (
                                            <Chip key={idx} label={cm?.name} />
                                        ))}
                                    </div>
                                </TableCell> */}

                                <TableCell align="right">
                                    <IconButton
                                        size="small"
                                        onClick={(e) => handleMenuOpen(e, s)}
                                    >
                                        <MoreVertIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination */}
            <TablePagination
                component="div"
                count={apiData?.totalCount}
                page={apiData?.pagination.page - 1}
                onPageChange={(e, newPage) => onPageChange(newPage + 1)}
                rowsPerPage={apiData?.pagination.limit}
                rowsPerPageOptions={[5, 10, 25]}
            />

            {/* Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={() => { console.log("View", menuRow); handleMenuClose(); }}>View</MenuItem>
                <MenuItem onClick={() => { console.log("Edit", menuRow); handleMenuClose(); }}>Edit</MenuItem>
                <MenuItem onClick={() => { console.log("Delete", menuRow); handleMenuClose(); }}>Delete</MenuItem>
            </Menu>
        </Paper>
    );
}
