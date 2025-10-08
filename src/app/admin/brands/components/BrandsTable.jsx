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

export default function BrandsTable({ apiData, onPageChange, limit, setLimit, dataLoading, onEdit }) {
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

    const page = apiData?.pagination?.page || 1;
    const pageLimit = apiData?.pagination?.limit || limit || 25;

    return (
        <div >
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

                    {dataLoading
                        ? <TableSkeleton2 rows={6} columns={6} />
                        : <TableBody>
                            {Array.isArray(apiData?.brands) && apiData.brands.length > 0 ? (
                                apiData.brands.map((brand, index) => (
                                    <TableRow hover key={brand._id}>
                                        <TableCell>{(page - 1) * pageLimit + index + 1}</TableCell>

                                        <TableCell>
                                            <div className="flex items-center">
                                                <Image
                                                    src={brand?.image || '/brand.png'}
                                                    alt={brand?.name || "brand"}
                                                    height={48}
                                                    width={48}
                                                    className="rounded"
                                                />
                                            </div>
                                        </TableCell>

                                        <TableCell>{brand.name}</TableCell>
                                        <TableCell>
                                            <Switch
                                                checked={Boolean(brand.active)}
                                                onChange={(e) => {
                                                    console.log("Toggled", brand._id, e.target.checked);
                                                    // optional: call updateBrand mutation for optimistic update
                                                }}
                                                color="primary"
                                            />
                                        </TableCell>

                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {Array.isArray(brand?.car_models) && brand.car_models.length > 0 ? (
                                                    brand.car_models.map((cm, idx) => <Chip key={cm?._id ?? idx} label={cm?.name || "-"} />)
                                                ) : (
                                                    <span className="text-gray-500 text-sm">—</span>
                                                )}
                                            </div>
                                        </TableCell>

                                        <TableCell align="right">
                                            <IconButton size="small" onClick={(e) => handleMenuOpen(e, brand)}>
                                                <MoreVertIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">No brands found.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    }
                </Table>
            </TableContainer>

            <TablePagination
                component="div"
                count={apiData?.totalCount || 0}
                page={page - 1}
                onPageChange={(e, newPage) => onPageChange(newPage + 1)}
                rowsPerPage={pageLimit}
                onRowsPerPageChange={(e) => {
                    const v = parseInt(e.target.value, 10);
                    setLimit && setLimit(v);
                    onPageChange(1);
                }}
                rowsPerPageOptions={[5, 10, 25, 50]}
            />

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={() => { console.log("View", menuRow); handleMenuClose(); }}>View</MenuItem>
                <MenuItem onClick={() => { handleMenuClose(); onEdit && onEdit(menuRow); }}>Edit</MenuItem>
                <MenuItem onClick={() => { console.log("Delete", menuRow); handleMenuClose(); }}>Delete</MenuItem>
            </Menu>
        </div>
    );
}
