// hooks/useProducts.js
import api from "@/lib/services/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useProducts = () => {
    const queryClient = useQueryClient();

    // Get all products in pagination
    const productsQuery = (params = {}) => {
        const filteredParams = Object.fromEntries(
            Object.entries(params || {}).filter(([_, value]) => value !== undefined && value !== null && value !== '')
        );

        return useQuery({
            queryKey: ['products', filteredParams],
            queryFn: () => api.get(`/inventory/product/paginated`, { params: filteredParams }),
            keepPreviousData: true,
            staleTime: 1000 * 60 * 5,
            onError: (err) => {
                toast.error(err?.response?.data?.message || err.message || 'Failed to fetch Products');
            },
            onSettled: () => {
                queryClient.invalidateQueries(['products']);
            }
        });
    }

    // Create New Product
    const createNewProduct = useMutation({
        mutationFn: ({ data }) => api.post('/inventory/product/create', data),
        onSuccess: () => {
            queryClient.invalidateQueries(['products']);
            toast.success('Product created successfully');
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || err.message || 'Failed to create Product');
        }
    });

    // Update Product
    const updateProduct = useMutation({
        mutationFn: ({ data }) => api.put('/inventory/product/update', data),
        onSuccess: () => {
            queryClient.invalidateQueries(['products']);
            toast.success('Product updated successfully');
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || err.message || 'Failed to update Product');
        }
    });

    // Update Stock
    const updateStock = useMutation({
        mutationFn: ({ productId, data }) => api.put('/inventory/product/stock/update', { productId, ...data }),
        onSuccess: () => {
            queryClient.invalidateQueries(['products']);
            toast.success('Stock updated successfully');
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || err.message || 'Failed to update stock');
        }
    });

    return {
        productsQuery,
        createNewProduct,
        updateProduct,
        updateStock,
    };
};