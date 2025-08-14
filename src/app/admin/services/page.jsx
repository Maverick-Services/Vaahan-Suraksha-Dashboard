"use client";
import React, { useState } from "react";
import InnerDashboardLayout from '@/components/dashboard/InnerDashboardLayout'
import PageHeading from '@/components/shared/PageHeading'
import { useServices } from '@/hooks/useServices';
import ServicesTable from "./components/ServicesTable";
import { Button } from "@mui/material";
import TableSkeleton from "@/components/shared/TableSkeleton";

function page() {
    const { servicesQuery } = useServices();
    const [page, setPage] = useState(1);

    const servicesData = servicesQuery({
        page,
        limit: 5,
    });

    if (servicesData.isLoading) {
        return (
            <InnerDashboardLayout>
                <div className="mb-5 flex items-center justify-between">
                    <PageHeading>Customers</PageHeading>
                    <Button variant="outlined">Add New</Button>
                </div>
                <TableSkeleton rows={5} />
            </InnerDashboardLayout>
        );
    }

    if (servicesData.isError) {
        return <div>Error: {servicesData.error?.message || "Failed to load Services"}</div>;
    }

    const apiData = servicesData?.data?.data?.data || {};

    return (
        <InnerDashboardLayout>
            <div className="mb-5 flex items-center justify-between">
                <PageHeading>Services</PageHeading>
                <div>
                    <Button
                        variant="outlined"
                    >
                        Add New
                    </Button>
                </div>
            </div>
            <ServicesTable
                apiData={apiData}
                onPageChange={(newPage) => setPage(newPage)}
            />
        </InnerDashboardLayout>
    )
}

export default page