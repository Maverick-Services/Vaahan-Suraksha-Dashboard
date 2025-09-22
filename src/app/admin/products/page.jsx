"use client";
import React, { useState } from "react";
import InnerDashboardLayout from '@/components/dashboard/InnerDashboardLayout'
import PageHeading from '@/components/shared/PageHeading'
import { Button } from "@mui/material";
// import TableSkeleton from "@/components/shared/TableSkeleton";
import ProductsTable from "./components/ProductsTable";
import { useProducts } from "@/hooks/useProducts";

export default function ProductsPage() {
    const { productsQuery } = useProducts();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(25);
    // const [dialogOpen, setDialogOpen] = useState(false);
    // const [editingItem, setEditingItem] = useState(null)

    const productsData = productsQuery({ page, limit });

    if (productsData.isError) {
        return <div>Error: {productsData.error?.message || "Failed to load Products"}</div>;
    }

    const apiData = productsData?.data?.data?.data || {};

    return (
        <InnerDashboardLayout>
            <div className="mb-5 flex items-center justify-between">
                <PageHeading>Products</PageHeading>
                <div>
                    <Button
                        variant="outlined"
                    >
                        Add New
                    </Button>
                </div>
            </div>
            <ProductsTable
                apiData={apiData}
                onPageChange={(newPage) => setPage(newPage)}
            />
        </InnerDashboardLayout>
    )
}