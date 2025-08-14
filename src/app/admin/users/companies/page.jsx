"use client";
import React, { useState } from "react";
import PageHeading from "@/components/shared/PageHeading";
import { useUsers } from "@/hooks/useUsers";
import { Button } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import InnerDashboardLayout from "@/components/dashboard/InnerDashboardLayout";
import TableSkeleton from "@/components/shared/TableSkeleton";
import CompanyTable from "./components/CompanyTable";

function Page() {
    const { usersQuery } = useUsers();
    const [page, setPage] = useState(1);

    const usersData = usersQuery({
        role: "company",
        page,
        limit: 5,
    });

    if (usersData.isLoading) {
        return (
            <InnerDashboardLayout>
                <div className="mb-5 flex items-center justify-between">
                    <PageHeading>Companies</PageHeading>
                    <Button variant="outlined">Add New</Button>
                </div>
                <TableSkeleton rows={5} />
            </InnerDashboardLayout>
        );
    }

    if (usersData.isError) {
        return <div>Error: {usersData.error?.message || "Failed to load employees"}</div>;
    }

    const apiData = usersData?.data?.data?.data || {};

    return (
        <InnerDashboardLayout>
            <div className="mb-5 flex items-center justify-between">
                <PageHeading>Companies</PageHeading>
                <div>
                    <Button
                        variant="outlined"

                    >
                        Add New
                    </Button>
                </div>
            </div>
            <CompanyTable
                apiData={apiData}
                onPageChange={(newPage) => setPage(newPage)}
            />
        </InnerDashboardLayout>
    );
}

export default Page;
