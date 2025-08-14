import api from "@/lib/services/axios";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useBrands = () => {

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
                toast.error(err.message || 'Failed to fetch Brands');
            },
            onSettled: () => {
                queryClient.invalidateQueries(['brands']);
            }
        });
    }

    return {
        brandsQuery
    }
}