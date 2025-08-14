"use client";
import React, { useState } from "react";
import InnerDashboardLayout from '@/components/dashboard/InnerDashboardLayout'
import PageHeading from '@/components/shared/PageHeading'
import { Button } from "@mui/material";
import TableSkeleton from "@/components/shared/TableSkeleton";
import MembersTable from "./components/MembersTable";
import { useMembers } from "@/hooks/company/useMembers";

function page() {
    const { membersQuery } = useMembers();
    const [page, setPage] = useState(1);

    const membersData = membersQuery({
        page,
        limit: 5,
    });

    if (membersData.isLoading) {
        return (
            <InnerDashboardLayout>
                <div className="mb-5 flex items-center justify-between">
                    <PageHeading>Members</PageHeading>
                    <Button variant="outlined">Add New</Button>
                </div>
                <TableSkeleton rows={5} />
            </InnerDashboardLayout>
        );
    }

    if (membersData.isError) {
        return <div>Error: {membersData.error?.message || "Failed to load Members"}</div>;
    }

    const apiData = membersData?.data?.data?.data || {};

    return (
        <InnerDashboardLayout>
            <div className="mb-5 flex items-center justify-between">
                <PageHeading>Members</PageHeading>
                <div>
                    <Button
                        variant="outlined"
                    >
                        Add New
                    </Button>
                </div>
            </div>
            <MembersTable
                apiData={apiData}
                onPageChange={(newPage) => setPage(newPage)}
            />
        </InnerDashboardLayout>
    )
}

export default page