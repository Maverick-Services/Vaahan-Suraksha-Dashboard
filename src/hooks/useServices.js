import api from "@/lib/services/axios";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useServices = () => {

    // Get all users in pagination
    const servicesQuery = (params) => {
        const filteredParams = Object.fromEntries(
            Object.entries(params).filter(([_, value]) => value !== undefined && value !== null && value !== '')
        );

        return useQuery({
            queryKey: ['services', filteredParams],
            queryFn: () => api.get(`/service/paginated`, { params: filteredParams }),
            keepPreviousData: true,
            staleTime: 1000 * 60 * 5,
            onError: (err) => {
                toast.error(err.message || 'Failed to fetch services');
            },
            onSettled: () => {
                queryClient.invalidateQueries(['services']);
            }
        });
    }

    return {
        servicesQuery
    }
}