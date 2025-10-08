// app/admin/products/components/ProductStockDrawer.jsx
"use client";

import React, { useEffect } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Button,
  FormControl,
  TextField,
  FormHelperText,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useProducts } from "@/hooks/useProducts";
import { formatDateWithTime } from "@/lib/services/dateFormat";
import { stockSchema } from "@/lib/validations";

export default function ProductStockDrawer({ open, onClose, product }) {
  const { updateStock } = useProducts();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(stockSchema),
    defaultValues: {
      vendor: "",
      purchasePrice: "",
      quantity: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({ vendor: "", purchasePrice: "", quantity: "" });
    }
  }, [open, reset]);

  const onSubmit = async (data) => {
    if (!product?._id) return;

    const payload = {
      vendor: data.vendor?.trim() || "-",
      purchasePrice: Number(data.purchasePrice || 0),
      quantity: Number(data.quantity),
    };

    try {
      await updateStock.mutateAsync({ productId: product._id, data: payload });
      reset();
      onClose();
    } catch (err) {
      console.error("Failed to update stock", err);
    }
  };

  const stockHistory = Array.isArray(product?.stock) ? product.stock : [];

  const isMutating = !!updateStock?.isPending;

  return (
    <Drawer anchor="right" open={!!open} onClose={onClose}>
      <Box sx={{ width: { xs: 360, sm: 640 }, p: 3 }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <Typography variant="h6" className="font-semibold">
              {product?.name || "Product"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Product ID: {product?._id}
            </Typography>
          </div>
          <IconButton onClick={onClose} size="small" aria-label="close">
            <CloseIcon />
          </IconButton>
        </div>

        <Divider sx={{ mb: 2 }} />

        {/* Add Stock Form */}
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mb: 3 }}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <FormControl fullWidth>
              <TextField
                label="Vendor"
                size="small"
                {...register("vendor")}
                error={Boolean(errors.vendor)}
              />
              {errors.vendor && <FormHelperText error>{errors.vendor?.message}</FormHelperText>}
            </FormControl>

            <FormControl fullWidth>
              <TextField
                label="Purchase Price"
                size="small"
                type="number"
                inputProps={{ min: 0, step: "0.01" }}
                {...register("purchasePrice")}
                error={Boolean(errors.purchasePrice)}
              />
              {errors.purchasePrice && <FormHelperText error>{errors.purchasePrice?.message}</FormHelperText>}
            </FormControl>

            <FormControl fullWidth>
              <TextField
                label="Quantity *"
                size="small"
                type="number"
                inputProps={{ step: "1" }}
                {...register("quantity")}
                error={Boolean(errors.quantity)}
              />
              {errors.quantity && <FormHelperText error>{errors.quantity?.message}</FormHelperText>}
            </FormControl>
          </div>

          {/* Buttons on right side */}
          <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => reset()}
              disabled={isMutating || isSubmitting}
            >
              Reset
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={isMutating || isSubmitting}
              startIcon={isMutating ? <CircularProgress size={18} /> : null}
            >
              {isMutating ? "Adding..." : "Add Stock"}
            </Button>
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Stock History Table */}
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
          Stock History
        </Typography>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Sr No</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Purchase Price</TableCell>
              <TableCell>Vendor</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stockHistory.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No stock history available
                </TableCell>
              </TableRow>
            ) : (
              stockHistory.map((st, idx) => (
                <TableRow key={st._id || `${idx}-${st.createdAt || st.updatedAt}`}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>{formatDateWithTime(st.updatedAt || st.createdAt)}</TableCell>
                  <TableCell>{st.quantity ?? "-"}</TableCell>
                  <TableCell>{st.purchasePrice ?? "-"}</TableCell>
                  <TableCell>{st.vendor ?? "-"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Box>
    </Drawer>
  );
}
