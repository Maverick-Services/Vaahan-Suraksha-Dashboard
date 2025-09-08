"use client";
import React from "react";
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Skeleton
} from "@mui/material";

export default function TableSkeleton({ rows = 5, columns = 5 }) {
    return (
        <div className="bg-white border border-gray-200">
            <TableContainer>
                <Table stickyHeader>
                    {/* <TableHead>
                        <TableRow>
                            {[...Array(columns)].map((_, idx) => (
                                <TableCell key={idx}>
                                    <Skeleton
                                        variant="text"
                                        width="80%"
                                        sx={{ bgcolor: "grey.400" }}
                                    />
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead> */}

                    <TableBody>
                        {[...Array(rows)].map((_, i) => (
                            <TableRow key={i}>
                                {[...Array(columns)].map((_, j) => (
                                    <TableCell key={j}>
                                        {j === columns - 1 ? (
                                            <Skeleton
                                                variant="rounded"
                                                width={64}
                                                height={24}
                                                sx={{ bgcolor: "grey.400" }}
                                            />
                                        ) : (
                                            <Skeleton
                                                variant="text"
                                                width={64}
                                                height={24}
                                                sx={{ bgcolor: "grey.400" }}
                                            />
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
