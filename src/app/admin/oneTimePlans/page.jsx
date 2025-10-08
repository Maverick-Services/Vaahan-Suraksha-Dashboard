// app/admin/oneTimePlans/page.jsx
"use client";
import React, { useState, useEffect, useMemo } from "react";
import InnerDashboardLayout from '@/components/dashboard/InnerDashboardLayout';
import { useOneTimePlans } from "@/hooks/useOneTimePlans";
import OneTimePlansTable from "./components/OtpTable";
import OtpDialog from "./components/OtpDialog";

import {
    Button,
    Box,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Tooltip,
} from "@mui/material";

import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';

function OneTimePlansPage() {
    // demo stats (replace with real values later)
    const demo = {
        totalPlans: 24,
        revenueAug2025: '₹ 1,24,000',
        services: 12,
        activePlans: 18,
    };

    const { oneTimePlansQuery } = useOneTimePlans();

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    // Search: input + debounced searchQuery (3000ms to match products)
    const [searchInput, setSearchInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    // Status filter state (active/inactive)
    const [status, setStatus] = useState("");

    useEffect(() => {
        const t = setTimeout(() => {
            setPage(1);
            setSearchQuery(searchInput.trim());
        }, 3000);

        return () => clearTimeout(t);
    }, [searchInput]);

    useEffect(() => {
        setPage(1);
    }, [status]);

    const queryParams = useMemo(() => ({
        page,
        limit,
        ...(searchQuery ? { searchQuery } : {}),
        ...(status ? { status } : {}),
    }), [page, limit, searchQuery, status]);

    const plansData = oneTimePlansQuery(queryParams);

    if (plansData.isError) {
        return <div>Error: {plansData.error?.message || "Failed to load One-time Plans"}</div>;
    }

    const apiData = plansData?.data?.data?.data || {
        plans: [],
        pagination: { page: 1, limit },
        totalCount: 0,
    };

    const handleResetFilters = () => {
        setSearchInput("");
        setSearchQuery("");
        setStatus("");
        setPage(1);
        plansData.refetch && plansData.refetch();
    };

    const StatCard = ({ title, value, Icon, color }) => (
        <div className="bg-white border border-gray-300 rounded-xl px-5 py-8 flex justify-between items-center hover:border-gray-300 duration-200 ease-in-out transition">
            <div>
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-sm text-gray-500">{title}</p>
            </div>
            <div className="w-14 h-14 flex items-center justify-center rounded-full" style={{ backgroundColor: color }}>
                <Icon sx={{ fontSize: 28, color: "#000" }} />
            </div>
        </div>
    );
// console.log(apiData)
    return (
        <InnerDashboardLayout>
            {/* Header */}
            <div className="mb-0 flex items-center justify-between">
                <div>
                    <h2 className="font-bold text-3xl mt-1">One-time Plans</h2>
                    <p className="text-gray-500 text-base">Manage one-time plans — create, edit and view plans.</p>
                </div>

                <div className="flex gap-3">
                    <Tooltip title="Refresh" arrow>
                        <span>
                            <Button
                                variant="outlined"
                                onClick={() => plansData.refetch && plansData.refetch()}
                                aria-label="Refresh"
                                disabled={!!plansData.isRefetching}
                                // keep same prop used in products page (project might have custom Button that reads `loading`)
                                loading={!!plansData.isRefetching}
                            >
                                <RefreshIcon />
                            </Button>
                        </span>
                    </Tooltip>

                    <Tooltip title="Export" arrow>
                        <span>
                            <Button variant="outlined" onClick={() => { /* TODO: export CSV */ }}>
                                <ArrowDownwardIcon />
                            </Button>
                        </span>
                    </Tooltip>

                    <Tooltip title="Add plan" arrow>
                        <span>
                            <Button
                                variant="outlined"
                                startIcon={<AddIcon />}
                                sx={{ textTransform: "capitalize" }}
                                onClick={() => { setEditingItem(null); setDialogOpen(true); }}
                                aria-label="Add Plan"
                            >
                                Add Plan
                            </Button>
                        </span>
                    </Tooltip>
                </div>
            </div>

            {/* Stats (placeholder values — wire to API later) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-5 w-full mb-6">
                <StatCard title="Plans" value={demo.totalPlans} Icon={Inventory2Icon} color="#ffffff" />
                <StatCard title="Revenue (Aug 2025)" value={demo.revenueAug2025} Icon={MonetizationOnIcon} color="#ffffff" />
                <StatCard title="Services" value={demo.services} Icon={BusinessIcon} color="#ffffff" />
                <StatCard title="Active Plans" value={demo.activePlans} Icon={PeopleIcon} color="#ffffff" />
            </div>

            {/* Table Section */}
            <div className="bg-white p-6 border border-gray-300 rounded-xl">
                <div className="mb-5 flex items-center justify-between">
                    <div>
                        <h2 className="font-semibold text-2xl">One-time Plans</h2>
                        <p className="text-gray-500 text-sm">Manage plans, pricing and services.</p>
                    </div>
                </div>

                {/* Search + Filters */}
                <div className="mb-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                    <Box className="flex-1" sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ position: 'absolute', left: 12, pointerEvents: 'none', color: '#9CA3AF' }}>
                            <SearchIcon />
                        </Box>

                        <TextField
                            variant="outlined"
                            placeholder="Search plans, name..."
                            size="small"
                            fullWidth
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    setSearchQuery(searchInput.trim());
                                    setPage(1);
                                }
                            }}
                            InputProps={{ style: { paddingLeft: 44 } }}
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "7px", minHeight: 40 } }}
                        />
                    </Box>

                    <Box sx={{ minWidth: 180 }}>
                        <FormControl fullWidth variant="outlined" size="small" sx={{ "& .MuiOutlinedInput-root": { borderRadius: "7px" } }}>
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

                    {/* Reset filters */}
                    <Tooltip title="Reset filters" arrow>
                        <span>
                            <Button variant="outlined" onClick={handleResetFilters} aria-label="Reset Filters">
                                <RestartAltIcon />
                            </Button>
                        </span>
                    </Tooltip>
                </div>

                <OneTimePlansTable
                    apiData={apiData}
                    onPageChange={(newPage) => setPage(newPage)}
                    limit={limit}
                    setLimit={setLimit}
                    dataLoading={plansData.isLoading}
                    onEdit={(row) => { setEditingItem(row); setDialogOpen(true); }}
                />
            </div>

            <OtpDialog
                open={dialogOpen}
                initialData={editingItem}
                onClose={() => { setDialogOpen(false); setEditingItem(null); }}
            />
        </InnerDashboardLayout>
    );
}

export default OneTimePlansPage;
