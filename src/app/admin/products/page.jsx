"use client";
import React, { useState } from "react";
import InnerDashboardLayout from '@/components/dashboard/InnerDashboardLayout'
import { useProducts } from "@/hooks/useProducts";
import ProductsTable from "./components/ProductsTable";
import {
    Button, Box, TextField, FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';
import SearchIcon from '@mui/icons-material/Search';
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

    const productsData = productsQuery({ page, limit });

    if (productsData.isError) {
        return <div>Error: {productsData.error?.message || "Failed to load Products"}</div>;
    }

    const apiData = productsData?.data?.data?.data || {};

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
                    <Button variant="outlined">
                        <RefreshIcon />
                    </Button>
                    <Button variant="outlined">
                        <ArrowDownwardIcon />
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        sx={{ textTransform: "capitalize" }}
                        onClick={() => setDialogOpen(true)}
                    >
                        Add Product
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-5 w-full mb-6">
                <StatCard title="Products" value={demo.totalProducts} Icon={Inventory2Icon} color="#fff" />
                <StatCard title="Sales (Aug 2025)" value={demo.salesAug2025} Icon={MonetizationOnIcon} color="#fff" />
                <StatCard title="Brands" value={demo.brands} Icon={BusinessIcon} color="#fff" />
                <StatCard title="Customers" value={demo.customers} Icon={PeopleIcon} color="#fff" />
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
                    <Box className="flex-1" sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <TextField
                            variant="outlined"
                            placeholder="Search products, IDs, names..."
                            size="small"
                            fullWidth
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "7px" } }}
                            slotProps={{
                                startAdornment: <SearchIcon style={{ marginRight: 4, color: '#9CA3AF' }} />,
                            }}
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
                                defaultValue=""
                            >
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="active">Active</MenuItem>
                                <MenuItem value="inactive">Inactive</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
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
