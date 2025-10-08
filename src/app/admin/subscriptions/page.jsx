"use client";
import React, { useState, useEffect, useMemo } from "react";
import InnerDashboardLayout from '@/components/dashboard/InnerDashboardLayout';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import SubscriptionsTable from './components/SubscriptionsTable';
import SubscriptionDialog from './components/SubscriptionDialog';
import { Button, Box, TextField, FormControl, InputLabel, Select, MenuItem, Tooltip, CircularProgress } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';

export default function SubscriptionsPage() {
    const demo = {
        totalProducts: 142,
        salesAug2025: '₹ 4,56,780',
        brands: 28,
        customers: 1024,
    };


    const { subscriptionsQuery } = useSubscriptions();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);

    // Search + debounce (3000ms to match your other modules)
    const [searchInput, setSearchInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    // status filter
    const [status, setStatus] = useState("");

    // dialog
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

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

    const subscriptionsData = subscriptionsQuery(queryParams);

    if (subscriptionsData.isError) {
        return <div>Error: {subscriptionsData.error?.message || "Failed to load Subscriptions"}</div>;
    }

    const apiData = subscriptionsData?.data?.data?.data || {
        subscriptions: [],
        pagination: { page: 1, limit },
        totalCount: 0,
    };

    const handleResetFilters = () => {
        setSearchInput("");
        setSearchQuery("");
        setStatus("");
        setPage(1);
        subscriptionsData.refetch && subscriptionsData.refetch();
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

    return (
        <InnerDashboardLayout>
            <div className="mb-5 flex items-center justify-between">
                 <div>
                    <h2 className="font-bold text-3xl mt-1">Subscriptions</h2>
                    <p className="text-gray-500 text-base">Manage all Subscriptions — add new, update.</p>
                </div>

                <div className="flex gap-3">
                    <Tooltip title="Refresh" arrow>
                        <span>
                            <Button
                                variant="outlined"
                                onClick={() => subscriptionsData.refetch && subscriptionsData.refetch()}
                                aria-label="Refresh"
                                disabled={!!subscriptionsData.isRefetching}
                            >
                                {subscriptionsData.isRefetching ? <CircularProgress size={18} /> : <RefreshIcon />}
                            </Button>
                        </span>
                    </Tooltip>

                    <Tooltip title="Download" arrow>
                        <span>
                            <Button variant="outlined" onClick={() => { /* TODO: download logic */ }}>
                                <ArrowDownwardIcon />
                            </Button>
                        </span>
                    </Tooltip>

                    <Tooltip title="Add subscription" arrow>
                        <span>
                            <Button
                                variant="outlined"
                                startIcon={<AddIcon />}
                                sx={{ textTransform: "capitalize" }}
                                onClick={() => setDialogOpen(true)}
                            >
                                Add New
                            </Button>
                        </span>
                    </Tooltip>
                </div>
            </div>

             {/* Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-5 w-full mb-6">
                            <StatCard title="Products" value={demo.totalProducts} Icon={Inventory2Icon} color="#ffffff" />
                            <StatCard title="Sales (Aug 2025)" value={demo.salesAug2025} Icon={MonetizationOnIcon} color="#ffffff" />
                            <StatCard title="Brands" value={demo.brands} Icon={BusinessIcon} color="#ffffff" />
                            <StatCard title="Customers" value={demo.customers} Icon={PeopleIcon} color="#ffffff" />
                        </div>

            {/* Search + Filters */}
            <div className="bg-white p-6 border border-gray-300 rounded-xl mb-6">
                <div className="mb-5">
                    <h2 className="font-semibold text-2xl">Subscription Plans</h2>
                    <p className="text-gray-500 text-sm">Manage subscription plans, subscribers, duration and limits.</p>
                </div>

                <div className="mb-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                    <Box className="flex-1" sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ position: 'absolute', left: 12, pointerEvents: 'none', color: '#9CA3AF' }}>
                            <SearchIcon />
                        </Box>

                        <TextField
                            variant="outlined"
                            placeholder="Search plans, name, id..."
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

                <SubscriptionsTable
                    apiData={apiData}
                    onPageChange={(newPage) => setPage(newPage)}
                    limit={limit}
                    setLimit={setLimit}
                    dataLoading={subscriptionsData.isLoading}
                    onEdit={(item) => { setEditingItem(item); setDialogOpen(true); }}
                />
            </div>

            <SubscriptionDialog
                open={dialogOpen}
                onClose={() => { setDialogOpen(false); setEditingItem(null); }}
                initialData={editingItem}
            />
        </InnerDashboardLayout>
    );
}
