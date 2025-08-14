"use client";
import React, { useState } from "react";
import InnerDashboardLayout from '@/components/dashboard/InnerDashboardLayout'
import PageHeading from '@/components/shared/PageHeading'
import { Button } from "@mui/material";
import TableSkeleton from "@/components/shared/TableSkeleton";
import { useCarModels } from "@/hooks/useCarModels";
import CarModelsTable from "./components/CarModelsTable";

function page() {
    const { carModelsQuery } = useCarModels();
    const [page, setPage] = useState(1);

    const carModelsData = carModelsQuery({
        page,
        limit: 5,
    });

    if (carModelsData.isLoading) {
        return (
            <InnerDashboardLayout>
                <div className="mb-5 flex items-center justify-between">
                    <PageHeading>Car Models</PageHeading>
                    <Button variant="outlined">Add New</Button>
                </div>
                <TableSkeleton rows={5} />
            </InnerDashboardLayout>
        );
    }

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
                    >
                        Add New
                    </Button>
                </div>
            </div>
            <CarModelsTable
                apiData={apiData}
                onPageChange={(newPage) => setPage(newPage)}
            />
        </InnerDashboardLayout>
    )
}

export default page