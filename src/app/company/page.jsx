"use client"
import InnerDashboardLayout from '@/components/dashboard/InnerDashboardLayout'
import PageHeading from '@/components/shared/PageHeading'
import { useAuthStore } from '@/stores/useAuthStore'
import React from 'react'

function page() {
    const { user } = useAuthStore()
    // const user = useAuthStore.getState(user)
    if (user) {
        console.log(user)
    }
    return (
        <InnerDashboardLayout>
            <PageHeading>Welcome, {user?.name}</PageHeading>
        </InnerDashboardLayout>
    )
}

export default page