"use client"
import React, { useState } from 'react'
import InnerDashboardLayout from '@/components/dashboard/InnerDashboardLayout'
import PageHeading from '@/components/shared/PageHeading'
import { useBrands } from '@/hooks/useBrands';
import BrandsTable from './components/BrandsTable';
import { Button } from "@mui/material";
import AddBrandDialog from './components/AddBrandDialog';

function page() {
    const { brandsQuery } = useBrands();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(25);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingBrand, setEditingBrand] = useState(null);

    const brandsData = brandsQuery({ page, limit });

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
                        onClick={() => { setEditingBrand(null); setDialogOpen(true); }}
                    >
                        Add New
                    </Button>
                </div>
            </div>

            <BrandsTable
                apiData={apiData}
                onPageChange={(newPage) => setPage(newPage)}
                limit={limit}
                setLimit={setLimit}
                dataLoading={brandsData.isLoading}
                onEdit={(brand) => { setEditingBrand(brand); setDialogOpen(true); }}
            />

            <AddBrandDialog
                open={dialogOpen}
                initialData={editingBrand}
                onClose={() => { setDialogOpen(false); setEditingBrand(null); }}
            />
        </InnerDashboardLayout>
    );
}

export default page;
