"use client";
import React from "react";
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Skeleton
} from "@mui/material";

export default function TableSkeleton({ rows = 5 }) {
    return (
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
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
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {[...Array(rows)].map((_, i) => (
                            <TableRow key={i}>
                                <TableCell>
                                    <Skeleton variant="text" width={20} />
                                </TableCell>
                                <TableCell>
                                    <Skeleton variant="text" width={80} />
                                </TableCell>
                                <TableCell>
                                    <Skeleton variant="text" width={120} />
                                </TableCell>
                                <TableCell>
                                    <Skeleton variant="text" width={100} />
                                </TableCell>
                                <TableCell>
                                    <Skeleton variant="text" width={160} />
                                </TableCell>
                                <TableCell>
                                    <Skeleton variant="text" width={100} />
                                </TableCell>
                                <TableCell align="right">
                                    <Skeleton variant="circular" width={24} height={24} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}
