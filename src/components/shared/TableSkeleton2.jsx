"use client";
import React from "react";
import { TableBody, TableRow, TableCell, Skeleton } from "@mui/material";

export default function TableSkeleton2({ rows = 5, columns = 5 }) {
    return (
        <TableBody>
            {Array.from({ length: rows }).map((_, r) => (
                <TableRow key={r}>
                    {Array.from({ length: columns }).map((_, c) => (
                        <TableCell key={c}>
                            <Skeleton variant="text" width="80%" height={24} />
                        </TableCell>
                    ))}
                </TableRow>
            ))}
        </TableBody>
    );
}
