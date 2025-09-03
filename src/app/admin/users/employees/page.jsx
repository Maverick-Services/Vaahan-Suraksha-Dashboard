"use client";
import React, { useState } from "react";
import PageHeading from "@/components/shared/PageHeading";
import { useUsers } from "@/hooks/useUsers";
import { Button } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import InnerDashboardLayout from "@/components/dashboard/InnerDashboardLayout";
import EmployeesTable from "./components/EmployeesTable";
import TableSkeleton from "@/components/shared/TableSkeleton";
import AddEmployeeDialog from "./components/EmployeeDialog";

function Page() {
    const { usersQuery } = useUsers();
    const [page, setPage] = useState(1);
    const [dialogOpen, setDialogOpen] = useState(false);

    const usersData = usersQuery({
        role: "employee",
        page,
        limit: 5,
    });

    if (usersData.isLoading) {
        return (
            <InnerDashboardLayout>
                <div className="mb-5 flex items-center justify-between">
                    <PageHeading>Employees</PageHeading>
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
                <PageHeading>Employees</PageHeading>
                <div>
                    <Button
                        variant="outlined"
                        onClick={() => setDialogOpen(true)}
                    >
                        Add New
                    </Button>
                </div>
            </div>

            {/* Employees Table */}
            <EmployeesTable
                apiData={apiData}
                onPageChange={(newPage) => setPage(newPage)}
            />

            {/* Dialog to add/edit employee */}
            <AddEmployeeDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
            />
        </InnerDashboardLayout>
    );
}

export default Page;
