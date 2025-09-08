import api from "@/lib/services/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useBrands = () => {
    const queryClient = useQueryClient();

    // Get all users in pagination
    const brandsQuery = (params) => {
        const filteredParams = Object.fromEntries(
            Object.entries(params || {}).filter(([_, value]) => value !== undefined && value !== null && value !== '')
        );

        return useQuery({
            queryKey: ['brands', filteredParams],
            queryFn: () => api.get(`/car/brand/paginated`, { params: filteredParams }),
            keepPreviousData: true,
            staleTime: 1000 * 60 * 5,
            onError: (err) => {
                toast.error(err?.response?.data?.message || 'Failed to fetch Brands');
            },
            onSettled: () => {
                queryClient.invalidateQueries(['brands']);
            }
        });
    }

    // Create New Brand
    const createNewBrand = useMutation({
        mutationFn: ({ data }) => api.post('/car/brand/create', data),
        onSuccess: () => {
            queryClient.invalidateQueries(['brands']);
            toast.success('Brand created successfully');
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || 'Failed to create brand');
        }
    })

    // Update Brand
    // const updateBrand = useMutation({
    //     mutationFn: ({ data }) => api.post('/car/brand/create', data),
    //     onSuccess: () => {
    //         queryClient.invalidateQueries(['brands']);
    //         toast.success('Brand created successfully');
    //     },
    //     onError: (err) => {
    //         toast.error(err?.response?.data?.message || 'Failed to create brand');
    //     }
    // })



    return {
        brandsQuery, createNewBrand
    }
}