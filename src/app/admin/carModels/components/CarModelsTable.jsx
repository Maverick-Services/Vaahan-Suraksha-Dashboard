"use client";
import React, { useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Menu, MenuItem,
  TablePagination, Chip, CircularProgress, Box
} from "@mui/material";
import Switch from "@mui/material/Switch";
import MoreVertIcon from '@mui/icons-material/MoreVert';
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

  const currentPage = apiData?.pagination?.page ?? 1;
  const pageLimit = apiData?.pagination?.limit ?? limit;
  const totalCount = apiData?.totalCount ?? 0;
  const rows = Array.isArray(apiData?.carModels) ? apiData.carModels : [];

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
              <TableCell>Active</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          {dataLoading ? (
            <TableSkeleton2 rows={6} columns={6} />
          ) : (
            <TableBody>
              {rows.length > 0 ? rows.map((carModel, index) => {
                const srNo = (currentPage - 1) * pageLimit + index + 1;
                return (
                  <TableRow hover key={carModel._id ?? `car-${index}`}>
                    <TableCell>{srNo}</TableCell>
                    <TableCell>
                      <div style={{ width: 80, height: 56, position: "relative" }}>
                        <Image
                          src={carModel?.image || '/model.png'}
                          alt={carModel?.name || "car model"}
                          fill={false}
                          height={56}
                          width={80}
                          style={{ objectFit: "contain" }}
                        />
                      </div>
                    </TableCell>
                    <TableCell>{carModel?.name}</TableCell>
                    <TableCell>
                      <Chip label={carModel?.brand?.name || "—"} />
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={!!carModel?.active}
                        onChange={(e) => {
                          console.log("Toggled", carModel?._id, e.target.checked);
                          // TODO: call toggle mutation
                        }}
                        color="primary"
                      />
                    </TableCell>

                    <TableCell align="right">
                      <IconButton size="small" onClick={(e) => handleMenuOpen(e, carModel)}>
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              }) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">No car models found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          )}
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={totalCount}
        page={Math.max((currentPage - 1), 0)}
        onPageChange={(e, newPage) => onPageChange(newPage + 1)}
        rowsPerPage={pageLimit}
        onRowsPerPageChange={(e) => {
          setLimit(parseInt(e.target.value, 10));
          onPageChange(1);
        }}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />

      {/* Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => { console.log("View", menuRow); handleMenuClose(); }}>View</MenuItem>
        <MenuItem onClick={() => { handleMenuClose(); onEdit && onEdit(menuRow); }}>Edit</MenuItem>
        <MenuItem onClick={() => { console.log("Delete", menuRow); handleMenuClose(); }}>Delete</MenuItem>
      </Menu>
    </div>
  );
}
