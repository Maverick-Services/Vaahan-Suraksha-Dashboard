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

export default function BrandsTable({ apiData, onPageChange }) {
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
                            <TableCell>Name</TableCell>
                            <TableCell>Active</TableCell>
                            <TableCell>Car Models</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {apiData?.brands?.map((brand, index) => (
                            <TableRow hover key={brand._id}>
                                <TableCell>{(apiData?.pagination.page - 1) * apiData?.pagination.limit + index + 1}</TableCell>
                                <TableCell>
                                    <div>
                                        <Image
                                            src={brand?.image || '/brand.png'}
                                            alt="brand"
                                            height={100}
                                            width={100}
                                        />
                                    </div>
                                </TableCell>
                                <TableCell>{brand.name}</TableCell>
                                <TableCell>
                                    <Switch
                                        checked={brand.active}
                                        onChange={(e) => {
                                            console.log("Toggled", brand._id, e.target.checked);
                                            // you can call an API here to update status
                                        }}
                                        color="primary"
                                    />
                                </TableCell>

                                <TableCell>
                                    <div className="flex flex-wrap max-w-80 gap-1">
                                        {brand?.car_models?.map((cm, idx) => (
                                            <Chip key={idx} label={cm?.name} />
                                        ))}
                                    </div>
                                </TableCell>

                                <TableCell align="right">
                                    <IconButton
                                        size="small"
                                        onClick={(e) => handleMenuOpen(e, brand)}
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
