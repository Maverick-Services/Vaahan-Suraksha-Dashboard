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

export default function MembersTable({ apiData, onPageChange }) {
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
                            <TableCell>User Id</TableCell>
                            <TableCell>Image</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Phone No</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Active</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {apiData?.members?.map((m, index) => (
                            <TableRow hover key={m?._id}>
                                <TableCell>{(apiData?.pagination.page - 1) * apiData?.pagination.limit + index + 1}</TableCell>
                                <TableCell>{m?.user_id}</TableCell>
                                <TableCell>
                                    <div>
                                        <Image
                                            src={m?.image || '/profile.jpg'}
                                            alt="m"
                                            height={60}
                                            width={60}
                                        />
                                    </div>
                                </TableCell>
                                <TableCell>{m?.name}</TableCell>
                                <TableCell>{m?.phoneNo}</TableCell>
                                <TableCell>{m?.email}</TableCell>
                                <TableCell><p className="uppercase">{m?.type}</p></TableCell>
                                <TableCell>
                                    <Switch
                                        checked={m.active}
                                        onChange={(e) => {
                                            console.log("Toggled", m._id, e.target.checked);
                                            // you can call an API here to update status
                                        }}
                                        color="primary"
                                    />
                                </TableCell>

                                <TableCell align="right">
                                    <IconButton
                                        size="small"
                                        onClick={(e) => handleMenuOpen(e, m)}
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
