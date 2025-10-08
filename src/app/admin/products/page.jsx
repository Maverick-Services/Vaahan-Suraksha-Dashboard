"use client";
import React, { useState, useEffect, useMemo } from "react";
import InnerDashboardLayout from '@/components/dashboard/InnerDashboardLayout'
import { useProducts } from "@/hooks/useProducts";
import ProductsTable from "./components/ProductsTable";
import {
    Button, Box, TextField, FormControl, InputLabel, Select, MenuItem,
    Tooltip
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';
import SearchIcon from '@mui/icons-material/Search';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ProductDialog from "./components/ProductDialog";
import ProductStockDrawer from "./components/ProductStockDrawer";

function ProductsPage() {
    const demo = {
        totalProducts: 142,
        salesAug2025: '₹ 4,56,780',
        brands: 28,
        customers: 1024,
    };

    const { productsQuery } = useProducts();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

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

    const productsData = productsQuery(queryParams);

    if (productsData.isError) {
        return <div>Error: {productsData.error?.message || "Failed to load Products"}</div>;
    }

    const apiData = productsData?.data?.data?.data || {
        products: [],
        pagination: { page: 1, limit },
        totalCount: 0,
    };

    // Reset filters handler
    const handleResetFilters = () => {
        setSearchInput("");
        setSearchQuery("");
        setStatus("");
        setPage(1);
        productsData.refetch && productsData.refetch();
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
            {/* Header */}
            <div className="mb-0 flex items-center justify-between">
                <div>
                    <h2 className="font-bold text-3xl mt-1">Products</h2>
                    <p className="text-gray-500 text-base">Manage all products — add new products, update stock and pricing.</p>
                </div>
                <div className="flex gap-3">
                    <Tooltip title="Refresh" arrow>
                        <span>
                            <Button
                                variant="outlined"
                                onClick={() => productsData.refetch && productsData.refetch()}
                                aria-label="Refresh"
                                disabled={!!productsData.isRefetching}
                                loading={!!productsData.isRefetching}
                            >
                              <RefreshIcon />
                            </Button>
                        </span>
                    </Tooltip>

                    <Tooltip title="Download" arrow>
                        <span>
                            <Button variant="outlined" onClick={() => { /* TODO: download CSV */ }}>
                                <ArrowDownwardIcon />
                            </Button>
                        </span>
                    </Tooltip>

                    <Tooltip title="Add product" arrow>
                        <span>
                            <Button
                                variant="outlined"
                                startIcon={<AddIcon />}
                                sx={{ textTransform: "capitalize" }}
                                onClick={() => setDialogOpen(true)}
                                aria-label="Add Product"
                            >
                                Add Product
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

            {/* Table Section */}
            <div className="bg-white p-6 border border-gray-300 rounded-xl">
                <div className="mb-5 flex items-center justify-between">
                    <div>
                        <h2 className="font-semibold text-2xl">Product Catalog</h2>
                        <p className="text-gray-500 text-sm">Manage your products, prices, stock levels, and toggle active status.</p>
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
                            placeholder="Search products, name, sku..."
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

                <ProductsTable
                    apiData={apiData}
                    onPageChange={(newPage) => setPage(newPage)}
                    limit={limit}
                    setLimit={setLimit}
                    dataLoading={productsData.isLoading}
                    onEdit={(e) => { setEditingItem(e); setDialogOpen(true); }}
                    onAddStock={(product) => { setSelectedProduct(product); setDrawerOpen(true); }}
                />
            </div>

            {/* Product Dialog */}
            <ProductDialog
                open={dialogOpen}
                initialData={editingItem}
                onClose={() => { setDialogOpen(false); setEditingItem(null); }}
            />

            <ProductStockDrawer
                open={drawerOpen}
                onClose={() => { setDrawerOpen(false); setSelectedProduct(null); }}
                product={selectedProduct}
            />
        </InnerDashboardLayout>
    )
}

export default ProductsPage;
