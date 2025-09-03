"use client";
import React, { useState } from "react";
import PageHeading from "@/components/shared/PageHeading";
import { useUsers } from "@/hooks/useUsers";
import { Button } from "@mui/material";
import InnerDashboardLayout from "@/components/dashboard/InnerDashboardLayout";
import CustomersTable from "../customers/components/CustomersTable";
import TableSkeleton from "@/components/shared/TableSkeleton";
import AddCustomerDialog from "./components/CustomerDialog";

function Page() {
    const { usersQuery } = useUsers();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5)
    const [dialogOpen, setDialogOpen] = useState(false);

    const usersData = usersQuery({
        role: "user",
        page,
        limit: 5,
    });

    if (usersData.isLoading) {
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

    if (usersData.isError) {
        return <div>Error: {usersData.error?.message || "Failed to load Users"}</div>;
    }

    const apiData = usersData?.data?.data?.data || {};

    return (
        <InnerDashboardLayout>
            <div className="mb-5 flex items-center justify-between">
                <PageHeading>Customers</PageHeading>
                <div>
                    <Button
                        variant="outlined"
                        onClick={() => setDialogOpen(true)}
                    >
                        Add New
                    </Button>
                </div>
            </div>

            {/* Customers Table */}
            <CustomersTable
                apiData={apiData}
                onPageChange={(newPage) => setPage(newPage)}
            />

            {/* Dialog to add/edit Customer */}
            <AddCustomerDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
            />
        </InnerDashboardLayout>
    );
}

export default Page;
