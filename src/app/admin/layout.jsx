// app/(admin)/layout.jsx  (or /admin/layout.jsx)
"use client"
import React, { useEffect, useState } from 'react'
import LayoutDashboard from "@/components/dashboard/LayoutDashboard"
import { USERTYPE } from '@/lib/constants';
import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter } from 'next/navigation';

function getTokenExpiry(token) {
    try {
        const payloadBase64 = token.split(".")[1];
        const decoded = atob(payloadBase64.replace(/-/g, "+").replace(/_/g, "/"));
        const obj = JSON.parse(decoded);
        console.log(obj)
        return obj.exp;
    } catch {
        return null;
    }
}

export default function AdminLayout({ children }) {
    const router = useRouter();
    const { user, initializeAuth, accessToken, refreshToken, clearAuth } = useAuthStore();

    const [checkingAuth, setCheckingAuth] = useState(true);

    useEffect(() => {
        initializeAuth();
    }, [initializeAuth])

    useEffect(() => {
        setTimeout(async () => {
            const storedAccess = useAuthStore.getState().accessToken;
            const storedRefresh = useAuthStore.getState().refreshToken;

            // If either token is missing, we cannot proceed
            if (!storedAccess || !storedRefresh) {
                clearAuth();
                router.replace("/");
                return;
            }

            if (user) {
                const allowed = [USERTYPE.EMPLOYEE, USERTYPE.ADMIN]
                if (!allowed.includes(user.role)) {
                    // unauthorized
                    setTimeout(() => {
                        alert('You are not authorized to access this page!')
                        router.replace('/')
                    }, 100)
                }
                return;
            }

            // Check access token expiry
            // const exp = getTokenExpiry(storedAccess);
            // const nowSec = Math.floor(Date.now() / 1000);

            // if (exp && exp > nowSec) {
            //     // Access token still valid
            //     setCheckingAuth(false);
            // }
        }, 0);
    }, [user, router, clearAuth])

    return (
        <LayoutDashboard>
            {children}
        </LayoutDashboard>
    )
}
