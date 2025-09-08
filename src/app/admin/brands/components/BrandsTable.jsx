"use client";
import React, { useState } from "react";
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, IconButton, Menu, MenuItem,
    TablePagination,
    Chip
} from "@mui/material";
import Switch from "@mui/material/Switch";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Image from "next/image";
import TableSkeleton2 from "@/components/shared/TableSkeleton2";

export default function BrandsTable({ apiData, onPageChange, limit, setLimit, dataLoading, onEdit }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [menuRow, setMenuRow] = useState(null);

    console.log(apiData)

    const handleMenuOpen = (event, row) => {
        setAnchorEl(event.currentTarget);
        setMenuRow(row);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setMenuRow(null);
    };

    return (
        <div className="bg-white border border-gray-200">
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
