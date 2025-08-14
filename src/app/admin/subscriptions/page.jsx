"use client"
import React, { useState } from 'react'
import InnerDashboardLayout from '@/components/dashboard/InnerDashboardLayout'
import PageHeading from '@/components/shared/PageHeading'
import { useSubscriptions } from '@/hooks/useSubscriptions';
import SubscriptionsTable from './components/SubscriptionsTable';
import { Button } from "@mui/material";
import TableSkeleton from "@/components/shared/TableSkeleton";

function page() {
    const { subscriptionsQuery } = useSubscriptions();
    const [page, setPage] = useState(1);

    const subscriptionsData = subscriptionsQuery({
        page,
        limit: 5,
    });

    if (subscriptionsData.isLoading) {
        return (
            <InnerDashboardLayout>
                <div className="mb-5 flex items-center justify-between">
                    <PageHeading>Subscriptions</PageHeading>
                    <Button variant="outlined">Add New</Button>
                </div>
                <TableSkeleton rows={5} />
            </InnerDashboardLayout>
        );
    }

    if (subscriptionsData.isError) {
        return <div>Error: {subscriptionsData.error?.message || "Failed to load Services"}</div>;
    }

    const apiData = subscriptionsData?.data?.data?.data || {};

    return (
        <InnerDashboardLayout>
            <div className="mb-5 flex items-center justify-between">
                <PageHeading>Subscriptions</PageHeading>
                <div>
                    <Button
                        variant="outlined"
                    >
                        Add New
                    </Button>
                </div>
            </div>
            <SubscriptionsTable
                apiData={apiData}
                onPageChange={(newPage) => setPage(newPage)}
            />
        </InnerDashboardLayout>
    )
}

export default page