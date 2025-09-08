"use client";
import React, { useState } from "react";
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, IconButton, Menu, MenuItem,
    TablePagination, Chip
} from "@mui/material";
import Switch from "@mui/material/Switch";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Image from "next/image";
import TableSkeleton2 from "@/components/shared/TableSkeleton2";

export default function CarModelsTable({ apiData, onPageChange, limit, setLimit, dataLoading, onEdit }) {
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
                            <TableCell>Active</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    {dataLoading
                        ? <TableSkeleton2 rows={6} columns={6} />
                        : <TableBody>
                            {apiData?.carModels?.map((carModel, index) => (
                                <TableRow hover key={carModel._id}>
                                    <TableCell>{(apiData?.pagination.page - 1) * apiData?.pagination.limit + index + 1}</TableCell>
                                    <TableCell>
                                        <div>
                                            <Image
                                                src={carModel?.image || '/model.png'}
                                                alt="carModel"
                                                height={100}
                                                width={100}
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell>{carModel.name}</TableCell>
                                    <TableCell><Chip label={carModel?.brand?.name} /></TableCell>
                                    <TableCell>
                                        <Switch
                                            checked={carModel.active}
                                            onChange={(e) => {
                                                console.log("Toggled", carModel._id, e.target.checked);
                                                // you can call an API here to update status
                                            }}
                                            color="primary"
                                        />
                                    </TableCell>

                                    <TableCell align="right">
                                        <IconButton
                                            size="small"
                                            onClick={(e) => handleMenuOpen(e, carModel)}
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
        </Paper>
    );
}
