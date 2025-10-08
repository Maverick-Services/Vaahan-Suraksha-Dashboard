// hooks/useOneTimePlans.js
import api from "@/lib/services/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useOneTimePlans = () => {
    const queryClient = useQueryClient();

    const oneTimePlansQuery = (params = {}) => {
        const filteredParams = Object.fromEntries(
            Object.entries(params || {}).filter(([_, value]) => value !== undefined && value !== null && value !== "")
        );

        return useQuery({
            queryKey: ["oneTimePlans", filteredParams],
            queryFn: () => api.get(`/oneTime/paginated`, { params: filteredParams }),
            keepPreviousData: true,
            staleTime: 1000 * 60 * 3,
            onError: (err) => {
                toast.error(err?.response?.data?.message || err.message || "Failed to fetch One-time Plans");
            },
            onSettled: () => {
                queryClient.invalidateQueries(["oneTimePlans"]);
            },
        });
    };

    const createOneTimePlan = useMutation({
        mutationFn: ({ data }) => api.post(`/oneTime/create`, data),
        onSuccess: () => {
            queryClient.invalidateQueries(["oneTimePlans"]);
            toast.success("Plan created successfully");
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || err.message || "Failed to create plan");
        },
    });

    const updateOneTimePlan = useMutation({
        mutationFn: ({ data }) => api.put(`/oneTime/update`, data),
        onSuccess: () => {
            queryClient.invalidateQueries(["oneTimePlans"]);
            toast.success("Plan updated successfully");
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || err.message || "Failed to update plan");
        },
    });

    const deleteOneTimePlan = useMutation({
        mutationFn: ({ id }) => api.delete(`/oneTime/delete/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries(["oneTimePlans"]);
            toast.success("Plan deleted successfully");
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || err.message || "Failed to delete plan");
        },
    });

    return {
        oneTimePlansQuery,
        createOneTimePlan,
        updateOneTimePlan,
        deleteOneTimePlan,
    };
};

export default useOneTimePlans;
