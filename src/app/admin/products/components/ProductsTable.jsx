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

export default function ProductsTable({ apiData, onPageChange }) {
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
                            <TableCell>Brand</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Stock</TableCell>
                            <TableCell>Active</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {apiData?.products?.map((product, index) => (
                            <TableRow hover key={product?._id}>
                                <TableCell>{(apiData?.pagination.page - 1) * apiData?.pagination.limit + index + 1}</TableCell>
                                <TableCell>
                                    <div>
                                        <Image
                                            src={product?.images?.[0] || '/model.png'}
                                            alt="product"
                                            height={100}
                                            width={100}
                                        />
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div>
                                        <h4>
                                            {product?.name}
                                        </h4>
                                        <p className="text-xs text-gray-500">{product?.description}</p>
                                    </div>
                                </TableCell>
                                <TableCell><Chip label={product?.brand?.name} /></TableCell>
                                <TableCell>
                                    <div>
                                        <h2 className="font-bold">{product?.sellingPrice}</h2>
                                        <p className="text-xs text-red-500 line-through">{product?.regularPrice}</p>
                                    </div>

                                </TableCell>
                                <TableCell><Chip label={product?.totalStock} /></TableCell>
                                <TableCell>
                                    <Switch
                                        checked={product?.active}
                                        onChange={(e) => {
                                            console.log("Toggled", product?._id, e.target.checked);
                                            // you can call an API here to update status
                                        }}
                                        color="primary"
                                    />
                                </TableCell>

                                <TableCell align="right">
                                    <IconButton
                                        size="small"
                                        onClick={(e) => handleMenuOpen(e, product)}
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
