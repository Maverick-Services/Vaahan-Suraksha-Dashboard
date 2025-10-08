"use client"
import React, { useState, useEffect } from 'react'
import InnerDashboardLayout from '@/components/dashboard/InnerDashboardLayout'
import PageHeading from '@/components/shared/PageHeading'
import { useBrands } from '@/hooks/useBrands';
import BrandsTable from './components/BrandsTable';
import {
    Button, Box, TextField, FormControl, InputLabel, Select, MenuItem, Tooltip
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import AddBrandDialog from './components/AddBrandDialog';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SearchIcon from '@mui/icons-material/Search';

function page() {
    const demo = {
        totalProducts: 142,
        salesAug2025: '₹ 4,56,780',
        brands: 28,
        customers: 1024,
    };

    const { brandsQuery } = useBrands();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingBrand, setEditingBrand] = useState(null);

    // search + debounce (3s to match other pages)
    const [searchInput, setSearchInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    // status filter (if brands support active/inactive)
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

    const queryParams = {
        page,
        limit,
        ...(searchQuery ? { searchQuery } : {}),
        ...(status ? { status } : {}),
    };

    const brandsData = brandsQuery(queryParams);

    if (brandsData.isError) {
        return <div>Error: {brandsData.error?.message || "Failed to load Brands"}</div>;
    }

    const apiData = brandsData?.data?.data?.data || {
        brands: [],
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
                <Icon sx={{ fontSize: 28, color: "#000" }} />
            </div>
        </div>
    );

    const handleResetFilters = () => {
        setSearchInput("");
        setSearchQuery("");
        setStatus("");
        setPage(1);
        if (brandsData?.refetch) brandsData.refetch();
    };

    return (
        <InnerDashboardLayout>
            <div className="mb-5 flex items-center justify-between">
                <div>
                    <h2 className="font-bold text-3xl mt-1">Brands</h2>
                    <p className="text-gray-500 text-base">Manage all brands — add new brands, update etc</p>
                </div>

                <div className="flex gap-3">
                    <Tooltip title="Refresh" arrow>
                        <span>
                            <LoadingButton
                                variant="outlined"
                                onClick={() => brandsData.refetch()}
                                loading={brandsData.isRefetching || brandsData.isFetching}
                                aria-label="Refresh"
                            >
                                <RefreshIcon />
                            </LoadingButton>
                        </span>
                    </Tooltip>

                    <Tooltip title="Download" arrow>
                        <span>
                            <Button variant="outlined" onClick={() => { /* TODO: export CSV */ }} aria-label="Download">
                                <ArrowDownwardIcon />
                            </Button>
                        </span>
                    </Tooltip>

                    <Tooltip title="Add brand" arrow>
                        <span>
                            <Button
                                variant="outlined"
                                onClick={() => { setEditingBrand(null); setDialogOpen(true); }}
                                startIcon={<AddIcon />}
                            >
                                Add New
                            </Button>
                        </span>
                    </Tooltip>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-5 w-full mb-6">
                <StatCard title="Products" value={demo.totalProducts} Icon={Inventory2Icon} color="#fff" />
                <StatCard title="Sales (Aug 2025)" value={demo.salesAug2025} Icon={MonetizationOnIcon} color="#fff" />
                <StatCard title="Brands" value={demo.brands} Icon={BusinessIcon} color="#fff" />
                <StatCard title="Customers" value={demo.customers} Icon={PeopleIcon} color="#fff" />
            </div>

            {/* Search + Filters */}
            <div className="bg-white p-6 border border-gray-300 rounded-xl mb-6">
                {/* <div className="mb-5 flex items-center justify-between">
                    <div>
                        <h2 className="font-semibold text-2xl">Brands Catalog</h2>
                        <p className="text-gray-500 text-sm">Manage your brands, prices, stock levels, and toggle active status.</p>
                    </div>
                </div> */}

                <div className="mb-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                    <Box className="flex-1" sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ position: 'absolute', left: 12, pointerEvents: 'none', color: '#9CA3AF' }}>
                            <SearchIcon />
                        </Box>

                        <TextField
                            variant="outlined"
                            placeholder="Search brands, name..."
                            size="small"
                            fullWidth
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            slotProps={{ input: { style: { paddingLeft: 44 } } }}
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "7px", minHeight: 40 } }}
                        />
                    </Box>

                    <Box sx={{ minWidth: 180 }}>
                        <FormControl fullWidth variant="outlined" size="small" sx={{ "& .MuiOutlinedInput-root": { borderRadius: "7px" } }}>
                            <InputLabel id="brand-status-filter">Status</InputLabel>
                            <Select labelId="brand-status-filter" label="Status" value={status} onChange={(e) => setStatus(e.target.value)}>
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="active">Active</MenuItem>
                                <MenuItem value="inactive">Inactive</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    <Tooltip title="Reset filters" arrow>
                        <span>
                            <Button variant="outlined" onClick={handleResetFilters} aria-label="Reset Filters">
                                <RestartAltIcon />
                            </Button>
                        </span>
                    </Tooltip>
                </div>

                <BrandsTable
                    apiData={apiData}
                    onPageChange={(newPage) => setPage(newPage)}
                    limit={limit}
                    setLimit={setLimit}
                    dataLoading={brandsData.isLoading}
                    onEdit={(brand) => { setEditingBrand(brand); setDialogOpen(true); }}
                />
            </div>

            <AddBrandDialog
                open={dialogOpen}
                initialData={editingBrand}
                onClose={() => { setDialogOpen(false); setEditingBrand(null); }}
            />
        </InnerDashboardLayout>
    );
}

export default page;
