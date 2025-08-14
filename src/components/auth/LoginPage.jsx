'use client'

import React, { useEffect, useState } from 'react'
import {
    Box,
    Button,
    TextField,
    FormControl,
    FormHelperText,
    InputAdornment,
    IconButton,
    Tabs,
    Tab,
    Typography,
} from '@mui/material'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { LoginPageSchema } from '@/lib/validations'
import { authEndpoints } from '@/lib/services/apis'
import axios from 'axios'
import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter } from 'next/navigation'
import { USERTYPE } from '@/lib/constants'
import LogoutButton from './LogoutButton'

export default function LoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const [tabIndex, setTabIndex] = useState(0)

    const { user, setAuth, initializeAuth } = useAuthStore();

    // useForm hook
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(LoginPageSchema),
        defaultValues: { role: 'employee', email: '', password: '' },
    })

    // hidden input for role
    const roleValue = watch('role')

    // Tab changing company and employee
    useEffect(() => {
        const newRole = tabIndex === 0 ? 'employee' : 'company'
        setValue('role', newRole, { shouldValidate: true, shouldDirty: true })
    }, [tabIndex])

    // initialize auth 
    useEffect(() => {
        initializeAuth();
    }, []);

    // redirect after user is known
    useEffect(() => {
        if (!user) return // wait until auth check finishes / user is set (or stays null)
        if (user.role === USERTYPE.COMPANY) {
            router.replace('/company')
        } else if (user.role === USERTYPE.EMPLOYEE || user.role === USERTYPE.ADMIN) {
            router.replace('/admin')
        } else {
            // fallback: unknown role — send to homepage or show error
            router.replace('/')
        }
    }, [user, router])

    // Login api call
    const onSubmit = async (data) => {
        setLoading(true)
        setErrorMessage(null)

        try {
            const res = await axios.post(authEndpoints.LOGIN_API, data);
            if (!res?.data?.success)
                throw new Error(res?.data?.message)

            const userData = res.data;
            setAuth(
                userData.data.user,
                userData.data.accessToken,
                userData.data.refreshToken
            );

        } catch (error) {
            console.log('Error: ', error?.response?.data?.message || error?.message)
            setErrorMessage(error?.response?.data?.message || error?.message)
        } finally {
            setLoading(false)
        }
    }

    console.log(user)

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100 p-2">
            <div className="bg-white rounded-md shadow-md p-4 sm:p-7 max-w-md w-full">
                <Typography variant="h5" align="center" fontWeight={700} gutterBottom marginBottom={3}>
                    DASHBOARD LOGIN
                </Typography>

                {/* Tabs for Admin / Company */}
                <Tabs
                    value={tabIndex}
                    onChange={(e, newVal) => setTabIndex(newVal)}
                    variant="fullWidth"
                    sx={{ mb: 2 }}
                >
                    <Tab label="Employee" />
                    <Tab label="Company" />
                </Tabs>

                <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
                    {/* hidden registered role field */}
                    <input type="hidden" {...register('role')} />

                    {/* Email */}
                    <FormControl fullWidth margin="normal" error={Boolean(errors.email)}>
                        <TextField
                            {...register('email')}
                            variant="outlined"
                            label="Email"
                            placeholder="Enter your email"
                            error={Boolean(errors.email)}
                        />
                        {errors.email && <FormHelperText>{errors.email.message}</FormHelperText>}
                    </FormControl>

                    {/* Password */}
                    <FormControl fullWidth margin="normal" error={Boolean(errors.password)}>
                        <TextField
                            variant="outlined"
                            label="Password"
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            {...register('password')}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label={showPassword ? 'hide the password' : 'display the password'}
                                            onClick={() => setShowPassword((s) => !s)}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            error={Boolean(errors.password)}
                        />
                        {errors.password && <FormHelperText>{errors.password.message}</FormHelperText>}
                    </FormControl>

                    {errorMessage &&
                        <p className='text-red-500 text-sm text-center mt-3'>{errorMessage}</p>
                    }

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3 }}
                        loading={loading}
                        color="primary"
                        loadingPosition="start"
                    >
                        Sign In
                    </Button>
                </Box>

                {/* small helper to indicate current role */}
                <Typography variant="caption" display="block" align="center" sx={{ mt: 2 }}>
                    Currently signing in as: <span className='font-bold capitalize'>{roleValue}</span>
                </Typography>
            </div>
        </div>
    )
}