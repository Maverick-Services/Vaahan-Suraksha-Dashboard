import api from "@/lib/services/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useCarModels = () => {
    const queryClient = useQueryClient();
    // Get all users in pagination
    const carModelsQuery = (params) => {
        const filteredParams = Object.fromEntries(
            Object.entries(params || {}).filter(([_, value]) => value !== undefined && value !== null && value !== '')
        );

        return useQuery({
            queryKey: ['carModels', filteredParams],
            queryFn: () => api.get(`/car/model/paginated`, { params: filteredParams }),
            keepPreviousData: true,
            staleTime: 1000 * 60 * 5,
            onError: (err) => {
                toast.error(err.message || 'Failed to fetch Car Models');
            },
            onSettled: () => {
                queryClient.invalidateQueries(['carModels']);
            }
        });
    }

    // Create Car Model
    const createNewCarModel = useMutation({
        mutationFn: ({ data }) => api.post('/car/model/create', data),
        onSuccess: () => {
            queryClient.invalidateQueries(['carModels']);
            toast.success('Car Model created successfully');
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || 'Failed to create Car Model');
        }
    })

    return {
        carModelsQuery, createNewCarModel
    }
}