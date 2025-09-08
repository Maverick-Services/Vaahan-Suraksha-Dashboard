"use client";
import React, { useState } from "react";
import InnerDashboardLayout from '@/components/dashboard/InnerDashboardLayout'
import PageHeading from '@/components/shared/PageHeading'
import { Button } from "@mui/material";
import { useCarModels } from "@/hooks/useCarModels";
import CarModelsTable from "./components/CarModelsTable";
import AddCarModelDialog from "./components/CarModelDialog";

function page() {
    const { carModelsQuery } = useCarModels();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(25);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null)

    const carModelsData = carModelsQuery({ page, limit });

    if (carModelsData.isError) {
        return <div>Error: {carModelsData.error?.message || "Failed to load Car Models"}</div>;
    }

    const apiData = carModelsData?.data?.data?.data || {};

    return (
        <InnerDashboardLayout>
            <div className="mb-5 flex items-center justify-between">
                <PageHeading>Car Models</PageHeading>
                <div>
                    <Button
                        variant="outlined"
                        onClick={() => setDialogOpen(true)}
                    >
                        Add New
                    </Button>
                </div>
            </div>

            {/* car models table */}
            <CarModelsTable
                apiData={apiData}
                onPageChange={(newPage) => setPage(newPage)}
                limit={limit}
                setLimit={setLimit}
                dataLoading={carModelsData.isLoading}
                onEdit={(brand) => { setEditingItem(brand); setDialogOpen(true); }}

            />

            {/* Dialog to add/edit Car model */}
            <AddCarModelDialog
                open={dialogOpen}
                initialData={editingItem}
                onClose={() => { setDialogOpen(false); setEditingItem(null); }}
            />
        </InnerDashboardLayout>
    )
}

export default page