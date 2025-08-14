import api from "@/lib/services/axios";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useSubscriptions = () => {

    // Get all users in pagination
    const subscriptionsQuery = (params) => {
        const filteredParams = Object.fromEntries(
            Object.entries(params || {}).filter(([_, value]) => value !== undefined && value !== null && value !== '')
        );

        return useQuery({
            queryKey: ['subscriptions', filteredParams],
            queryFn: () => api.get(`/service/subscription/paginated`, { params: filteredParams }),
            keepPreviousData: true,
            staleTime: 1000 * 60 * 5,
            onError: (err) => {
                toast.error(err.message || 'Failed to fetch Subscriptions');
            },
            onSettled: () => {
                queryClient.invalidateQueries(['subscriptions']);
            }
        });
    }

    return {
        subscriptionsQuery
    }
}