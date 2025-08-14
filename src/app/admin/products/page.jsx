"use client";
import React, { useState } from "react";
import InnerDashboardLayout from '@/components/dashboard/InnerDashboardLayout'
import PageHeading from '@/components/shared/PageHeading'
import { Button } from "@mui/material";
import TableSkeleton from "@/components/shared/TableSkeleton";
import ProductsTable from "./components/ProductsTable";
import { useProducts } from "@/hooks/useProducts";

function page() {
    const { productsQuery } = useProducts();
    const [page, setPage] = useState(1);

    const productsData = productsQuery({
        page,
        limit: 5,
    });

    if (productsData.isLoading) {
        return (
            <InnerDashboardLayout>
                <div className="mb-5 flex items-center justify-between">
                    <PageHeading>Products</PageHeading>
                    <Button variant="outlined">Add New</Button>
                </div>
                <TableSkeleton rows={5} />
            </InnerDashboardLayout>
        );
    }

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

export default page