"use client";
import React, { useState, useEffect } from "react";
import { useUsers } from "@/hooks/useUsers";
import {
    Button, Box, TextField, FormControl, InputLabel, Select, MenuItem, Tooltip
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SearchIcon from '@mui/icons-material/Search';
import InnerDashboardLayout from "@/components/dashboard/InnerDashboardLayout";
import AdminTable from "./components/AdminTable";
import AdminDialog from "./components/AdminDialog";

export default function AdminsPage() {
    const { usersQuery } = useUsers();

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);

    // Search immediate & debounced
    const [searchInput, setSearchInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    // Status filter
    const [status, setStatus] = useState("");

    // Dialog
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    // Debounce search (3s to match your Customers debounce)
    useEffect(() => {
        const t = setTimeout(() => {
            setPage(1);
            setSearchQuery(searchInput.trim());
        }, 3000);

        return () => clearTimeout(t);
    }, [searchInput]);

    // Reset page when filter changes
    useEffect(() => {
        setPage(1);
    }, [status]);

    // Build query params
    const queryParams = {
        role: "admin",
        page,
        limit,
        ...(searchQuery ? { searchQuery } : {}),
        ...(status ? { status } : {}),
    };

    const usersData = usersQuery(queryParams); // same usage as Customers

    const handleResetFilters = () => {
        setSearchInput("");
        setSearchQuery("");
        setStatus("");
        setPage(1);
        if (usersData?.refetch) usersData.refetch();
    };

    if (usersData.isError) {
        return <div>Error: {usersData.error?.message || "Failed to load admins"}</div>;
    }

    // safe default
    const apiData = usersData?.data?.data?.data || {
        users: [],
        pagination: { page: 1, limit },
        totalCount: 0,
    };

    return (
        <InnerDashboardLayout>
            <div className="mb-0 flex items-center justify-between">
                <div>
                    <h2 className="font-bold text-3xl mt-1">Admins</h2>
                    <p className="text-gray-500 text-base">Manage admins — add new, search, export or refresh.</p>
                </div>

                <div className="flex gap-3">
                    <Tooltip title="Refresh" arrow>
                        <span>
                            <Button
                                variant="outlined"
                                onClick={() => usersData.refetch()}
                                aria-label="Refresh"
                                loading={usersData.isRefetching}
                            >
                                <RefreshIcon />
                            </Button>
                        </span>
                    </Tooltip>

                    <Tooltip title="Download" arrow>
                        <span>
                            <Button
                                variant="outlined"
                                onClick={() => { /* TODO: implement CSV / export */ }}
                                aria-label="Download"
                            >
                                <ArrowDownwardIcon />
                            </Button>
                        </span>
                    </Tooltip>

                    <Tooltip title="Add admin" arrow>
                        <span>
                            <Button
                                variant="outlined"
                                startIcon={<AddIcon />}
                                sx={{ textTransform: "capitalize" }}
                                onClick={() => { setEditingItem(null); setDialogOpen(true); }}
                                aria-label="Add Admin"
                            >
                                Add Admin
                            </Button>
                        </span>
                    </Tooltip>
                </div>
            </div>

            {/* Table Card */}
            <div className="bg-white p-6 border border-gray-300 rounded mt-5">
                {/* Search + Filters */}
                <div className="mb-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                    <Box className="flex-1" sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ position: 'absolute', left: 12, pointerEvents: 'none', color: '#9CA3AF' }}>
                            <SearchIcon />
                        </Box>

                        <TextField
                            variant="outlined"
                            placeholder="Search admins, name, id..."
                            size="small"
                            fullWidth
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            slotProps={{
                                input: {
                                    style: { paddingLeft: 44 },
                                },
                            }}
                            sx={{
                                "& .MuiOutlinedInput-root": { borderRadius: "3px", minHeight: 40 }
                            }}
                        />
                    </Box>

                    <Box sx={{ minWidth: 180 }}>
                        <FormControl
                            fullWidth
                            variant="outlined"
                            size="small"
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "3px" } }}
                        >
                            <InputLabel id="status-filter-label">Status</InputLabel>
                            <Select
                                labelId="status-filter-label"
                                label="Status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="active">Active</MenuItem>
                                <MenuItem value="inactive">Inactive</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    <Tooltip title="Reset filters" arrow>
                        <span>
                            <Button
                                variant="outlined"
                                onClick={handleResetFilters}
                                aria-label="Reset Filters"
                            >
                                <RestartAltIcon />
                            </Button>
                        </span>
                    </Tooltip>
                </div>

                <AdminTable
                    apiData={apiData}
                    onPageChange={(newPage) => setPage(newPage)}
                    limit={limit}
                    setLimit={setLimit}
                    dataLoading={usersData.isLoading}
                    onEdit={(item) => { setEditingItem(item); setDialogOpen(true); }}
                />
            </div>

            <AdminDialog
                open={dialogOpen}
                onClose={() => { setDialogOpen(false); setEditingItem(null); }}
                initialData={editingItem}
            />
        </InnerDashboardLayout>
    );
}
