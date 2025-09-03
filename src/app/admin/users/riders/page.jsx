"use client";
import React, { useState } from "react";
import PageHeading from "@/components/shared/PageHeading";
import { useUsers } from "@/hooks/useUsers";
import { Button } from "@mui/material";
import InnerDashboardLayout from "@/components/dashboard/InnerDashboardLayout";
import TableSkeleton from "@/components/shared/TableSkeleton";
import RidersTable from "./components/RidersTable";
import AddRiderDialog from "./components/RiderDialog";

function Page() {
    const { usersQuery } = useUsers();
    const [page, setPage] = useState(1);
    const [dialogOpen, setDialogOpen] = useState(false);

    const usersData = usersQuery({
        role: "rider",
        page,
        limit: 5,
    });

    if (usersData.isLoading) {
        return (
            <InnerDashboardLayout>
                <div className="mb-5 flex items-center justify-between">
                    <PageHeading>Riders</PageHeading>
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
                <PageHeading>Riders</PageHeading>
                <div>
                    <Button
                        variant="outlined"
                        onClick={() => setDialogOpen(true)}
                    >
                        Add New
                    </Button>
                </div>
            </div>

            {/* riders table */}
            <RidersTable
                apiData={apiData}
                onPageChange={(newPage) => setPage(newPage)}
            />

            {/* Dialog to add/edit rider */}
            <AddRiderDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
            />
        </InnerDashboardLayout>
    );
}

export default Page;
