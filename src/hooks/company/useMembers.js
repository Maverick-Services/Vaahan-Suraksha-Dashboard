import api from "@/lib/services/axios";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useMembers = () => {

    // Get all users in pagination
    const membersQuery = (params) => {
        const filteredParams = Object.fromEntries(
            Object.entries(params || {}).filter(([_, value]) => value !== undefined && value !== null && value !== '')
        );

        return useQuery({
            queryKey: ['members', filteredParams],
            queryFn: () => api.get(`/user/members/paginated`, { params: filteredParams }),
            keepPreviousData: true,
            staleTime: 1000 * 60 * 5,
            onError: (err) => {
                toast.error(err.message || 'Failed to fetch Members');
            },
            onSettled: () => {
                queryClient.invalidateQueries(['members']);
            }
        });
    }

    return {
        membersQuery
    }
}