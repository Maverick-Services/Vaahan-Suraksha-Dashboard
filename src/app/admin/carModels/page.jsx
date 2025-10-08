"use client";
import React, { useState, useEffect, useMemo } from "react";
import InnerDashboardLayout from '@/components/dashboard/InnerDashboardLayout';
import {
    Button, Box, TextField, FormControl, InputLabel, Select, MenuItem, Tooltip, CircularProgress
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SearchIcon from '@mui/icons-material/Search';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import PeopleIcon from '@mui/icons-material/People';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CategoryIcon from '@mui/icons-material/Category';
import InfoIcon from '@mui/icons-material/Info';

import { useCarModels } from "@/hooks/useCarModels";
import CarModelsTable from "./components/CarModelsTable";
import AddCarModelDialog from "./components/CarModelDialog";

export default function CarModelsPage() {
    const demo = {
        totalModels: 512,
        newThisMonth: 8,
        active: 480,
        brands: 24,
    };

    const { carModelsQuery } = useCarModels();

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const [searchInput, setSearchInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    // Status filter
    const [status, setStatus] = useState("");

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

    const carModelsData = carModelsQuery(queryParams);

    // Reset filters
    const handleResetFilters = () => {
        setSearchInput("");
        setSearchQuery("");
        setStatus("");
        setPage(1);
        carModelsData.refetch && carModelsData.refetch();
    };

    if (carModelsData.isError) {
        return <div>Error: {carModelsData.error?.message || "Failed to load Car Models"}</div>;
    }

    const apiData = carModelsData?.data?.data?.data || {
        carModels: [],
        pagination: { page: 1, limit },
        totalCount: 0,
    };

    const StatCard = ({ title, value, Icon, color }) => (
        <div className="bg-white border border-gray-300 rounded-xl px-5 py-8 flex justify-between items-center hover:border-gray-300 duration-200 ease-in-out transition">
            <div>
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-sm text-gray-500">{title}</p>
            </div>
            <div className="w-14 h-14 flex items-center justify-center rounded-full" style={{ backgroundColor: color }}>
                <Icon sx={{ fontSize: 28, color: "#fff" }} />
            </div>
        </div>
    );

    return (
        <InnerDashboardLayout>
            {/* Header */}
            <div className="mb-0 flex items-center justify-between">
                <div>
                    <h2 className="font-bold text-3xl mt-1">Car Models</h2>
                    <p className="text-gray-500 text-base">Manage car models — add new, view details, export or search.</p>
                </div>

                <div className="flex gap-3">
                    <Tooltip title="Refresh" arrow>
                        <span>
                            <Button
                                variant="outlined"
                                onClick={() => carModelsData.refetch && carModelsData.refetch()}
                                aria-label="Refresh"
                                loading={carModelsData.isRefetching}
                            >
                                <RefreshIcon />
                            </Button>
                        </span>
                    </Tooltip>

                    <Tooltip title="Download" arrow>
                        <span>
                            <Button
                                variant="outlined"
                                onClick={() => { /* TODO: download */ }}
                                aria-label="Download"
                            >
                                <ArrowDownwardIcon />
                            </Button>
                        </span>
                    </Tooltip>

                    <Tooltip title="Add car model" arrow>
                        <span>
                            <Button
                                variant="outlined"
                                startIcon={<AddIcon />}
                                sx={{ textTransform: "capitalize" }}
                                onClick={() => setDialogOpen(true)}
                                aria-label="Add Car Model"
                            >
                                Add New
                            </Button>
                        </span>
                    </Tooltip>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mt-5 w-full mb-6">
                <StatCard title="Models" value={apiData?.totalCount ?? demo.totalModels} Icon={DirectionsCarIcon} color="#111827" />
                <StatCard title="Active" value={demo.active} Icon={PeopleIcon} color="#059669" />
                <StatCard title="Brands" value={demo.brands} Icon={CategoryIcon} color="#f59e0b" />
            </div>

            {/* Table Section */}
            <div className="bg-white p-6 border border-gray-300 rounded-xl">
                <div className="mb-5 flex items-center justify-between">
                    <div>
                        <h2 className="font-semibold text-2xl">Car Models Directory</h2>
                        <p className="text-gray-500 text-sm">Search and manage car models, export data or add new models.</p>
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
                            placeholder="Search models, name, brand..."
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
                            sx={{
                                "& .MuiOutlinedInput-root": { borderRadius: "7px", minHeight: 40 }
                            }}
                        />
                    </Box>

                    <Box sx={{ minWidth: 180 }}>
                        <FormControl
                            fullWidth
                            variant="outlined"
                            size="small"
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "7px" } }}
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

                <CarModelsTable
                    apiData={apiData}
                    onPageChange={(newPage) => setPage(newPage)}
                    limit={limit}
                    setLimit={setLimit}
                    dataLoading={carModelsData.isLoading}
                    onEdit={(item) => { setEditingItem(item); setDialogOpen(true); }}
                />
            </div>

            <AddCarModelDialog
                open={dialogOpen}
                initialData={editingItem}
                onClose={() => { setDialogOpen(false); setEditingItem(null); }}
            />
        </InnerDashboardLayout>
    );
}
