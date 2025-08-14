
import api from "@/lib/services/axios";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useProducts = () => {

    // Get all users in pagination
    const productsQuery = (params) => {
        const filteredParams = Object.fromEntries(
            Object.entries(params || {}).filter(([_, value]) => value !== undefined && value !== null && value !== '')
        );

        return useQuery({
            queryKey: ['products', filteredParams],
            queryFn: () => api.get(`/inventory/product/paginated`, { params: filteredParams }),
            keepPreviousData: true,
            staleTime: 1000 * 60 * 5,
            onError: (err) => {
                toast.error(err.message || 'Failed to fetch Products');
            },
            onSettled: () => {
                queryClient.invalidateQueries(['products']);
            }
        });
    }

    return {
        productsQuery
    }
}