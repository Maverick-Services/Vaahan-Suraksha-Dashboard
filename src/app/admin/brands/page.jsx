"use client"
import React, { useState } from 'react'
import InnerDashboardLayout from '@/components/dashboard/InnerDashboardLayout'
import PageHeading from '@/components/shared/PageHeading'
import { useBrands } from '@/hooks/useBrands';
import BrandsTable from './components/BrandsTable';
import { Button } from "@mui/material";
import TableSkeleton from "@/components/shared/TableSkeleton";
import AddBrandDialog from './components/AddBrandDialog';

function page() {
    const { brandsQuery } = useBrands();
    const [page, setPage] = useState(1);
    const [dialogOpen, setDialogOpen] = useState(false);

    const brandsData = brandsQuery({
        page,
        limit: 5,
    });

    if (brandsData.isLoading) {
        return (
            <InnerDashboardLayout>
                <div className="mb-5 flex items-center justify-between">
                    <PageHeading>Brands</PageHeading>
                    <Button
                        variant="outlined"
                        onClick={() => setDialogOpen(true)}
                    >
                        Add New
                    </Button>
                </div>
                <TableSkeleton rows={5} />
            </InnerDashboardLayout>
        );
    }

    if (brandsData.isError) {
        return <div>Error: {brandsData.error?.message || "Failed to load Services"}</div>;
    }

    const apiData = brandsData?.data?.data?.data || {};


    return (
        <InnerDashboardLayout>
            <div className="mb-5 flex items-center justify-between">
                <PageHeading>Brands</PageHeading>
                <div>
                    <Button
                        variant="outlined"
                        onClick={() => setDialogOpen(true)}
                    >
                        Add New
                    </Button>
                </div>
            </div>
            <BrandsTable
                apiData={apiData}
                onPageChange={(newPage) => setPage(newPage)}
            />
            {/* Dialog component placed once at page level */}
            <AddBrandDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
            />
        </InnerDashboardLayout>
    )
}

export default page