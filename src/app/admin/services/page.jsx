// app/admin/services/page.jsx
"use client";
import React, { useState, useEffect, useMemo } from "react";
import InnerDashboardLayout from '@/components/dashboard/InnerDashboardLayout'
import { useServices } from '@/hooks/useServices';
import ServicesTable from "./components/ServicesTable";
import { Button, Box, TextField, FormControl, InputLabel, Select, MenuItem, Tooltip, CircularProgress } from "@mui/material";
import ServiceDialog from "./components/ServiceDialog";
import BuildIcon from '@mui/icons-material/Build';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

function ServicesPage() {
    const demo = {
        serviceOrders: 128,
        salesAug2025: '₹ 1,24,560',
        servicesCount: 24,
        productsCount: 142,
        customers: 1024,
        companies: 68,
    };

    const { servicesQuery } = useServices();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    // Search: immediate input + debounced searchQuery (3000ms to match customers module)
    const [searchInput, setSearchInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    // Status filter state
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

    const servicesData = servicesQuery(queryParams);

    if (servicesData.isError) {
        return <div>Error: {servicesData.error?.message || "Failed to load Services"}</div>;
    }

    const apiData = servicesData?.data?.data?.data || {
        services: [],
        pagination: { page: 1, limit },
        totalCount: 0,
    };

    // Reset filters handler
    const handleResetFilters = () => {
        setSearchInput("");
        setSearchQuery("");
        setStatus("");
        setPage(1);
        servicesData.refetch && servicesData.refetch();
    };

    const StatCard = ({ title, value, Icon, color }) => (
        <div className="bg-white  border border-gray-300 rounded-xl px-5 py-8 flex justify-between items-center hover:border-gray-300 duration-200 ease-in-out transition">
            <div>
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-sm text-gray-500">{title}</p>
            </div>
            <div className={`w-14 h-14 flex items-center justify-center rounded-full`} style={{ backgroundColor: color }}>
                <Icon sx={{ fontSize: 28, color: '#000' }} />
            </div>
        </div>
    );

    return (
        <InnerDashboardLayout>
            <div className="mb-5 flex items-center justify-between">
                <div>
                    <h2 className="font-bold text-3xl mt-1">Services</h2>
                    <p className="text-gray-500 text-base">Manage all services — add new services, upload service images.</p>
                </div>

                <div className="flex gap-3">
                    <Tooltip title="Refresh" arrow>
                        <span>
                            <Button
                                variant="outlined"
                                onClick={() => servicesData.refetch && servicesData.refetch()}
                                aria-label="Refresh"
                                disabled={!!servicesData.isRefetching}
                                loading={!!servicesData.isRefetching}
                            >
                                 <RefreshIcon />
                            </Button>
                        </span>
                    </Tooltip>

                    <Tooltip title="Download" arrow>
                        <span>
                            <Button
                                variant="outlined"
                                onClick={() => { /* TODO: download logic */ }}
                                aria-label="Download"
                            >
                                <ArrowDownwardIcon />
                            </Button>
                        </span>
                    </Tooltip>

                    <Tooltip title="Add Service" arrow>
                        <span>
                            <Button
                                variant="outlined"
                                startIcon={<AddIcon />}
                                sx={{ textTransform: "capitalize" }}
                                onClick={() => setDialogOpen(true)}
                                aria-label="Add Service"
                            >
                                Add Service
                            </Button>
                        </span>
                    </Tooltip>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mt-8 w-full mb-6">
                <StatCard title="Service Orders" value={demo.serviceOrders} Icon={BuildIcon} color="#ffffff" />
                <StatCard title="Sales (Aug 2025)" value={demo.salesAug2025} Icon={MonetizationOnIcon} color="#ffffff" />
                <StatCard title="Services" value={demo.servicesCount} Icon={MiscellaneousServicesIcon} color="#ffffff" />
                <StatCard title="Products" value={demo.productsCount} Icon={Inventory2Icon} color="#ffffff" />
            </div>

            <div className="bg-white p-6 border border-gray-300 rounded-xl">
                <div className="mb-5 flex items-center justify-between">
                    <div>
                        <h2 className="font-semibold text-2xl">Service Catalog</h2>
                        <p className="text-gray-500 text-sm">Manage your services, pricing, features and toggle active status.</p>
                    </div>
                </div>

                {/* Search bar + Status filter */}
                <div className="mb-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                    <Box className="flex-1" sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ position: 'absolute', left: 12, pointerEvents: 'none', color: '#9CA3AF' }}>
                            <SearchIcon />
                        </Box>

                        <TextField
                            variant="outlined"
                            placeholder="Search services, IDs, names..."
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
                        <FormControl
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "7px" } }}
                            fullWidth
                            variant="outlined"
                            size="small"
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

                    {/* Reset filters */}
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

                <ServicesTable
                    apiData={apiData}
                    onPageChange={(newPage) => setPage(newPage)}
                    limit={limit}
                    setLimit={setLimit}
                    dataLoading={servicesData.isLoading}
                    onEdit={(e) => { setEditingItem(e); setDialogOpen(true); }}
                />
            </div>

            <ServiceDialog
                open={dialogOpen}
                initialData={editingItem}
                onClose={() => { setDialogOpen(false); setEditingItem(null); }}
            />
        </InnerDashboardLayout>
    )
}

export default ServicesPage;
