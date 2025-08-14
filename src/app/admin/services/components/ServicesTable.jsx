"use client";
import React, { useState } from "react";
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, IconButton, Menu, MenuItem,
    TablePagination
} from "@mui/material";
import Switch from "@mui/material/Switch";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { formatDate_DD_MMM_YYYY } from "@/lib/services/dateFormat";
import Image from "next/image";

export default function ServicesTable({ apiData, onPageChange }) {
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
                            <TableCell>Image</TableCell>
                            <TableCell>Service ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Active</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {apiData?.services?.map((service, index) => (
                            <TableRow hover key={service._id}>
                                <TableCell>{(apiData?.pagination.page - 1) * apiData?.pagination.limit + index + 1}</TableCell>
                                <TableCell>
                                    <div>
                                        <Image
                                            src={service?.images[0] || '/226.jpg'}
                                            alt="Service"
                                            height={100}
                                            width={100}
                                        />
                                    </div>
                                </TableCell>
                                <TableCell>{service.service_id}</TableCell>
                                <TableCell>{service.name}</TableCell>
                                <TableCell>
                                    <Switch
                                        checked={service.active}
                                        onChange={(e) => {
                                            console.log("Toggled", service._id, e.target.checked);
                                            // you can call an API here to update status
                                        }}
                                        color="primary"
                                    />
                                </TableCell>

                                <TableCell align="right">
                                    <IconButton
                                        size="small"
                                        onClick={(e) => handleMenuOpen(e, service)}
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
