"use client";

import React, { useState } from "react";
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, IconButton, Menu, MenuItem,
    TablePagination, Chip, Switch
} from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TableSkeleton2 from "@/components/shared/TableSkeleton2";
import { formatDate_DD_MMM_YYYY } from "@/lib/services/dateFormat";

export default function CustomersTable({ apiData, onPageChange, limit, setLimit, dataLoading, onEdit }) {
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

    return (
        <div>
            <TableContainer>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>Sr No</TableCell>
                            <TableCell>User ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Phone No</TableCell>
                            <TableCell>Email ID</TableCell>
                            <TableCell>Joining Date</TableCell>
                            <TableCell>Active</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    {dataLoading ? (
                        <TableSkeleton2 rows={6} columns={8} />
                    ) : (
                        <TableBody>
                            {Array.isArray(apiData?.users) && apiData.users.length > 0 ? (
                                apiData.users.map((user, index) => (
                                    <TableRow hover key={user._id}>
                                        <TableCell>{(apiData?.pagination.page - 1) * apiData?.pagination.limit + index + 1}</TableCell>
                                        <TableCell>{user.user_id}</TableCell>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.phoneNo}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{formatDate_DD_MMM_YYYY(user.createdAt)}</TableCell>
                                        <TableCell>
                                            <Switch
                                                checked={user?.active}
                                                onChange={(e) => {
                                                    console.log("Toggled", user?._id, e.target.checked);
                                                    // API call to toggle active status
                                                }}
                                                color="primary"
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton size="small" onClick={(e) => handleMenuOpen(e, user)}>
                                                <MoreVertIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={8} align="center">No customers found.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    )}
                </Table>
            </TableContainer>

            {/* Pagination */}
            <TablePagination
                component="div"
                count={apiData?.totalCount || 0}
                page={apiData?.pagination?.page - 1 || 0}
                onPageChange={(e, newPage) => onPageChange(newPage + 1)}
                rowsPerPage={limit || 0}
                onRowsPerPageChange={(e) => {
                    setLimit(parseInt(e.target.value, 10));
                    onPageChange(1);
                }}
                rowsPerPageOptions={[5, 10, 25, 50]}
            />

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={() => { console.log("View", menuRow); handleMenuClose(); }}>View</MenuItem>
                <MenuItem onClick={() => { handleMenuClose(); onEdit && onEdit(menuRow); }}>Edit</MenuItem>
                <MenuItem onClick={() => { console.log("Delete", menuRow); handleMenuClose(); }}>Delete</MenuItem>
            </Menu>
        </div>
    );
}
