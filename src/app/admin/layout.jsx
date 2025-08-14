// app/(admin)/layout.jsx  (or /admin/layout.jsx)
"use client"
import React, { useEffect } from 'react'
import LayoutDashboard from "@/components/dashboard/LayoutDashboard"
import { USERTYPE } from '@/lib/constants';
import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter } from 'next/navigation';

export default function AdminLayout({ children }) {
    const router = useRouter();
    const { user, initializeAuth } = useAuthStore();

    // run once to populate store from localStorage (or API)
    useEffect(() => {
        initializeAuth();
    }, [initializeAuth]);

    useEffect(() => {
        // run only on client
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

        // If we have a user, validate role immediately
        if (user) {
            const allowed = [USERTYPE.EMPLOYEE, USERTYPE.ADMIN]
            if (!allowed.includes(user.role)) {
                // unauthorized
                setTimeout(() => {
                    alert('You are not authorized to access this page!')
                    router.replace('/')
                }, 100)
            }
            return
        }

        // If there's no user but also no token -> definitely not logged in
        if (!user && !token) {
            router.replace('/')
        }

        // If !user but token exists -> allow initializeAuth() time to set user
    }, [user, router])

    return (
        <LayoutDashboard>
            {children}
        </LayoutDashboard>
    )
}
