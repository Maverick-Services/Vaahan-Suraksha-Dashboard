"use client"
import { USERTYPE } from '@/lib/constants';
import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

function layout({ children }) {

    const router = useRouter();
    const { user, initializeAuth } = useAuthStore();

    // initializing auth
    useEffect(() => {
        initializeAuth();
    }, [initializeAuth])

    useEffect(() => {
        // run only on client
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

        // If we have a user, validate role immediately
        if (user) {
            const allowed = [USERTYPE.COMPANY]
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
        <div>{children}</div>
    )
}

export default layout