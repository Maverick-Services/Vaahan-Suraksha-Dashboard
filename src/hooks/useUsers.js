import api from "@/lib/services/axios";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useUsers = () => {

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

    return {
        usersQuery
    }
}