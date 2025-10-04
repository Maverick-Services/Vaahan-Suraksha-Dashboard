"use client";
import React, { useState } from "react";
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, IconButton, Menu, MenuItem,
    TablePagination, Chip
} from "@mui/material";
import Switch from "@mui/material/Switch";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Image from "next/image";
import TableSkeleton2 from "@/components/shared/TableSkeleton2";

export default function ProductsTable({ apiData, onPageChange, limit, setLimit, dataLoading, onEdit, onAddStock  }) {
    console.log(apiData)
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
                            <TableCell>Image</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Brand</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Stock</TableCell>
                            <TableCell>Active</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    {dataLoading
                        ? <TableSkeleton2 rows={6} columns={8} />
                        : <TableBody>
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
                                            <h4>{product?.name}</h4>
                                            <p className="text-xs text-gray-500">{product?.description}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell><Chip label={product?.brand?.name} /></TableCell>
                                    <TableCell>
                                        <div>
                                            <h2 className="font-bold">₹{product?.sellingPrice}</h2>
                                            <p className="text-xs text-red-500 line-through">₹{product?.regularPrice}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Chip label={product?.totalStock} />
                                    </TableCell>
                                    <TableCell>
                                        <Switch
                                            checked={product?.active}
                                            onChange={(e) => {
                                                console.log("Toggled", product?._id, e.target.checked);
                                                // API call to toggle active status
                                            }}
                                            color="primary"
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton size="small" onClick={(e) => handleMenuOpen(e, product)}>
                                            <MoreVertIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    }
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

            {/* Menu */}
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={() => { console.log("View", menuRow); handleMenuClose(); }}>View</MenuItem>
                <MenuItem onClick={() => { console.log("Edit", menuRow); onEdit && onEdit(menuRow); handleMenuClose(); }}>Edit</MenuItem>
                <MenuItem onClick={() => { console.log("Add Stock", menuRow); onAddStock && onAddStock(menuRow); handleMenuClose(); }}>Add Stock</MenuItem>
            </Menu>
        </div>
    );
}
