import api from "@/lib/services/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useServices = () => {
    const queryClient = useQueryClient();

    // Get all services in pagination
    const servicesQuery = (params = {}) => {
        const safeParams = params || {};
        const filteredParams = Object.fromEntries(
            Object.entries(safeParams).filter(([_, value]) => value !== undefined && value !== null && value !== '')
        );

        return useQuery({
            queryKey: ['services', filteredParams],
            queryFn: () => api.get(`/service/paginated`, { params: filteredParams }),
            keepPreviousData: true,
            staleTime: 1000 * 60 * 5,
            onError: (err) => {
                toast.error(err?.response?.data?.message || err.message || 'Failed to fetch services');
            },
            onSettled: () => {
                queryClient.invalidateQueries(['services']);
            }
        });
    }

    // Create New Service
    const createNewService = useMutation({
        mutationFn: ({ data }) => api.post('/service/create', data),
        onSuccess: () => {
            queryClient.invalidateQueries(['services']);
            toast.success('Service created successfully');
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || 'Failed to create Service');
        }
    })

    // Update Service
    const updateService = useMutation({
        mutationFn: ({ data }) => api.put('/service/update', data),
        onSuccess: () => {
            queryClient.invalidateQueries(['services']);
            toast.success('Service created successfully');
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || 'Failed to create Service');
        }
    })

    return {
        servicesQuery, createNewService, updateService
    }
}
