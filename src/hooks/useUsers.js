import api from "@/lib/services/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useUsers = () => {
    const queryClient = useQueryClient();

    // Get all users in pagination
    const usersQuery = (params) => {
        const filteredParams = Object.fromEntries(
            Object.entries(params).filter(([_, value]) => value !== undefined && value !== null && value !== '')
        );

        return useQuery({
            queryKey: ['users', filteredParams],
            queryFn: () => api.get(`/user/paginated`, { params: filteredParams }),
            keepPreviousData: true,
            staleTime: 1000 * 60 * 5,
            onError: (err) => {
                toast.error(err.message || 'Failed to fetch users');
            },
            onSettled: () => {
                queryClient.invalidateQueries(['users']);
            }
        });
    }

    // Create Employee
    const createNewEmployee = useMutation({
        mutationFn: ({ data }) => api.post('/user/createEmploye', data),
        onSuccess: () => {
            queryClient.invalidateQueries(['users']);
            toast.success('Employee created successfully');
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || 'Failed to create employee');
        }
    })

    // Create Company
    const createNewCompany = useMutation({
        mutationFn: ({ data }) => api.post('/user/createCompany', data),
        onSuccess: () => {
            queryClient.invalidateQueries(['users']);
            toast.success('Company created successfully');
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || 'Failed to create Company');
        }
    })

    // Create Rider
    const createNewRider = useMutation({
        mutationFn: ({ data }) => api.post('/user/createRider', data),
        onSuccess: () => {
            queryClient.invalidateQueries(['users']);
            toast.success('Rider created successfully');
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || 'Failed to create Rider');
        }
    })

    // Create User
    const createNewUser = useMutation({
        mutationFn: ({ data }) => api.post('/user/createUser', data),
        onSuccess: () => {
            queryClient.invalidateQueries(['users']);
            toast.success('User created successfully');
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || 'Failed to create User');
        }
    })

    // update any type of user
    const updateUser = useMutation({
        mutationFn: ({ data }) => api.put('/user/update', data),
        onSuccess: () => {
            queryClient.invalidateQueries(['users']);
            toast.success('User updated successfully');
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || 'Failed to update User');
        }
    })

    return {
        usersQuery,
        createNewEmployee, createNewCompany, createNewUser, createNewRider,
        updateUser,
    }
}