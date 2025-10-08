"use client";
import React, { useState } from "react";
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, IconButton, Menu, MenuItem,
    TablePagination, Chip, Typography,
    Switch
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import TableSkeleton2 from "@/components/shared/TableSkeleton2";
import { formatDateWithTime } from "@/lib/services/dateFormat";

export default function OtpTable({ apiData, onPageChange, limit, setLimit, dataLoading, onEdit }) {
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

    const rows = apiData?.plans || [];

    return (
        <div>
            <TableContainer>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>Sr No</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Services</TableCell>
                            <TableCell>Pricing</TableCell>
                            <TableCell>Last Modified</TableCell>
                            <TableCell>Active</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    {dataLoading ? (
                        <TableSkeleton2 rows={6} columns={7} />
                    ) : (
                        <TableBody>
                            {rows.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        <Typography>No plans found</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : rows.map((plan, idx) => (
                                <TableRow hover key={plan._id || idx}>
                                    <TableCell>{(apiData?.pagination.page - 1) * apiData?.pagination.limit + idx + 1}</TableCell>
                                    <TableCell>
                                        <div>
                                            <strong>{plan?.name || "-"}</strong>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {Array.isArray(plan?.services) && plan.services.length > 0 ? (
                                            plan.services.slice(0, 3).map((s, i) => <Chip key={i} label={s.name || s} size="small" sx={{ mr: 0.5 }} />)
                                        ) : (
                                            <span>-</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {/* pricing is object; stringify small summary */}
                                        {plan?.pricing && Object.keys(plan.pricing).length > 0 ? (
                                            <div>
                                                {Object.entries(plan.pricing).slice(0, 3).map(([k, v]) => (
                                                    <div key={k} style={{ fontSize: 13 }}>{k}: {typeof v === "object" ? JSON.stringify(v) : String(v)}</div>
                                                ))}
                                            </div>
                                        ) : <span>-</span>}
                                    </TableCell>
                                    <TableCell>{formatDateWithTime(plan.updatedAt || plan.createdAt)}</TableCell>
                                    <TableCell>
                                        <Switch
                                            checked={plan?.active}
                                            onChange={(e) => {
                                                // API call to toggle active status
                                            }}
                                            color="primary"
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton size="small" onClick={(e) => handleMenuOpen(e, plan)}>
                                            <MoreVertIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    )}
                </Table>
            </TableContainer>

            <TablePagination
                component="div"
                count={apiData?.totalCount || 0}
                page={Math.max((apiData?.pagination?.page || 1) - 1, 0)}
                onPageChange={(e, newPage) => onPageChange(newPage + 1)}
                rowsPerPage={limit || 0}
                onRowsPerPageChange={(e) => {
                    setLimit(parseInt(e.target.value, 10));
                    onPageChange(1);
                }}
                rowsPerPageOptions={[5, 10, 25, 50]}
            />

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={() => { onEdit && onEdit(menuRow); handleMenuClose(); }}>Edit</MenuItem>
                <MenuItem onClick={() => { /* TODO: delete handler */ handleMenuClose(); }}>Delete</MenuItem>
            </Menu>
        </div>
    );
}
