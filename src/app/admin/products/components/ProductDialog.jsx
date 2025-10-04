"use client";

import React, { useEffect, useRef, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    IconButton,
    FormControl,
    FormHelperText,
    Box,
    FormControlLabel,
    Switch,
    Select,
    MenuItem,
    InputLabel,
    CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema } from "@/lib/validations";
import { useCarModels } from "@/hooks/useCarModels";
import { useBrands } from "@/hooks/useBrands";
import Image from "next/image";
import toast from "react-hot-toast";
import { uploadImage2 } from "@/lib/services/uploadImage";
import { useProducts } from "@/hooks/useProducts";

export default function ProductDialog({ open, onClose, initialData = null }) {
    const fileInputRef = useRef(null);
    const { createNewProduct, updateProduct } = useProducts();

    // car models
    const { carModelsQuery } = useCarModels();
    const carModelsData = carModelsQuery({ page: 1, limit: 200 });
    const carModels = carModelsData?.data?.data?.data?.carModels || [];

    // brands
    const { brandsQuery } = useBrands();
    const brandsData = brandsQuery({ page: 1, limit: 200 });
    const brands = brandsData?.data?.data?.data?.brands || [];

    const [isUploading, setIsUploading] = useState(false);

    const {
        register,
        handleSubmit,
        control,
        reset,
        setValue,
        getValues,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: "",
            description: "",
            brandId: "",
            carModelId: "",
            sku: "",
            hsn: "",
            gst: 0,
            regularPrice: 0,
            sellingPrice: 0,
            images: [],
            active: true,
        },
    });

    useEffect(() => {
        if (initialData) {
            // prefill values from initialData (guard for undefined)
            reset({
                name: initialData.name || "",
                description: initialData.description || "",
                brandId: initialData.brand?._id || initialData.brand || "",
                carModelId: initialData.car_model?._id || initialData.car_model || "",
                sku: initialData.sku || "",
                hsn: initialData.hsn || "",
                gst: typeof initialData.gst === "number" ? initialData.gst : 0,
                regularPrice: typeof initialData.regularPrice === "number" ? initialData.regularPrice : (initialData.regularPrice ?? 0),
                sellingPrice: typeof initialData.sellingPrice === "number" ? initialData.sellingPrice : (initialData.sellingPrice ?? 0),
                images: Array.isArray(initialData.images) ? initialData.images : [],
                active: typeof initialData.active === "boolean" ? initialData.active : true,
            });
        } else {
            reset({
                name: "",
                description: "",
                brandId: "",
                carModelId: "",
                sku: "",
                hsn: "",
                gst: 0,
                regularPrice: 0,
                sellingPrice: 0,
                images: [],
                active: true,
            });
        }
    }, [initialData, open, reset]);

    const images = watch("images") || [];

    const onSubmit = async (formData) => {
        try {
            // If editing, include identifier so backend can update. Adjust key if your backend expects different shape.
            if (initialData) {
                const payload = { ...formData, productId: initialData._id };
                await updateProduct.mutateAsync({ data: payload });
                onClose();
                return;
            }

            // create new product
            await createNewProduct.mutateAsync({ data: formData });
            reset();
            onClose();
        } catch (err) {
            console.error(err);
        }
    };

    // Upload Images
    const handleFilesSelected = async (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const toastId = toast.loading("Uploading images...");
        const uploadedUrls = [];

        try {
            setIsUploading(true);
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                try {
                    const url = await uploadImage2(file);
                    if (url) uploadedUrls.push(url);
                } catch (err) {
                    console.error("Image upload failed:", err);
                }
            }

            const existing = getValues("images") || [];
            setValue("images", [...existing, ...uploadedUrls], { shouldValidate: true });
            toast.success("Images uploaded", { id: toastId });
        } finally {
            setIsUploading(false);
            // clear input so same file can be reselected later
            e.target.value = "";
        }
    };

    const removeImageAt = (index) => {
        const current = getValues("images") || [];
        const next = current.filter((_, i) => i !== index);
        setValue("images", next, { shouldValidate: true });
    };

    const openFilePicker = () => fileInputRef.current?.click();

    return (
        <Dialog
            open={!!open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            aria-labelledby="add-product-dialog"
        >
            <DialogTitle id="add-product-dialog" className="flex items-center justify-between">
                {initialData ? "Edit Product" : "Create Product"}
                <IconButton size="small" onClick={onClose} aria-label="close">
                    <CloseIcon fontSize="small" />
                </IconButton>
            </DialogTitle>

            <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
                <DialogContent dividers>
                    {/* Name */}
                    <FormControl fullWidth margin="normal" error={Boolean(errors.name)}>
                        <TextField {...register("name")} label="Name" error={Boolean(errors.name)} />
                        {errors.name && <FormHelperText>{errors.name.message}</FormHelperText>}
                    </FormControl>

                    {/* Description */}
                    <FormControl fullWidth margin="normal" error={Boolean(errors.description)}>
                        <TextField
                            {...register("description")}
                            label="Description"
                            multiline
                            rows={3}
                            error={Boolean(errors.description)}
                        />
                        {errors.description && <FormHelperText>{errors.description.message}</FormHelperText>}
                    </FormControl>

                    {/* Brand & Car Model selects */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <FormControl fullWidth margin="normal" error={Boolean(errors.brand)}>
                            <InputLabel id="brand-select-label">Brand</InputLabel>
                            <Controller
                                name="brandId"
                                control={control}
                                render={({ field }) => (
                                    <Select labelId="brand-select-label" label="Brand" {...field} value={field.value || ""}>
                                        <MenuItem value="">None</MenuItem>
                                        {brands?.map((b) => (
                                            <MenuItem key={b._id || b.id || b} value={b._id || b.id || b}>
                                                {b.name || b.title || b}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                )}
                            />
                            {errors.brandId && <FormHelperText>{errors.brandId.message}</FormHelperText>}
                        </FormControl>

                        <FormControl fullWidth margin="normal" error={Boolean(errors.carModelId)}>
                            <InputLabel id="car-model-select-label">Car Model</InputLabel>
                            <Controller
                                name="carModelId"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        labelId="car-model-select-label"
                                        label="Car Model"
                                        {...field}
                                        value={field.value || ""}
                                    >
                                        <MenuItem value="">None</MenuItem>
                                        {carModels?.map((cm) => (
                                            <MenuItem key={cm._id || cm.id || cm} value={cm._id || cm.id || cm}>
                                                {cm.name || cm.title || cm}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                )}
                            />
                            {errors.carModelId && <FormHelperText>{errors.carModelId.message}</FormHelperText>}
                        </FormControl>
                    </div>

                    {/* SKU / HSN / GST */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <FormControl fullWidth margin="normal" error={Boolean(errors.sku)}>
                            <TextField {...register("sku")} label="SKU" />
                            {errors.sku && <FormHelperText>{errors.sku.message}</FormHelperText>}
                        </FormControl>

                        <FormControl fullWidth margin="normal" error={Boolean(errors.hsn)}>
                            <TextField {...register("hsn")} label="HSN" />
                            {errors.hsn && <FormHelperText>{errors.hsn.message}</FormHelperText>}
                        </FormControl>

                        <FormControl fullWidth margin="normal" error={Boolean(errors.gst)}>
                            <TextField
                                {...register("gst")}
                                label="GST (%)"
                                type="number"
                                inputProps={{ min: 0, step: "0.01" }}
                            />
                            {errors.gst && <FormHelperText>{errors.gst.message}</FormHelperText>}
                        </FormControl>
                    </div>

                    {/* Prices */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <FormControl fullWidth margin="normal" error={Boolean(errors.regularPrice)}>
                            <TextField
                                {...register("regularPrice", { valueAsNumber: true })}
                                label="Regular Price"
                                type="number"
                                inputProps={{ min: 0, step: "0.01" }}
                            />
                            {errors.regularPrice && <FormHelperText>{errors.regularPrice.message}</FormHelperText>}
                        </FormControl>

                        <FormControl fullWidth margin="normal" error={Boolean(errors.sellingPrice)}>
                            <TextField
                                {...register("sellingPrice", { valueAsNumber: true })}
                                label="Selling Price"
                                type="number"
                                inputProps={{ min: 0, step: "0.01" }}
                            />
                            {errors.sellingPrice && <FormHelperText>{errors.sellingPrice.message}</FormHelperText>}
                        </FormControl>
                    </div>

                    {/* Images */}
                    <FormControl fullWidth margin="normal" error={Boolean(errors.images)}>
                        <p className="mb-2">Images</p>

                        {/* previews */}
                        <div className="grid grid-cols-1 gap-3">
                            {Array.isArray(images) && images.length > 0 ? (
                                images.map((url, idx) => (
                                    <div key={`${url}-${idx}`} className="relative group rounded overflow-hidden">
                                        <div style={{ position: "relative", width: "100%", height: 220 }}>
                                            <Image
                                                src={url}
                                                alt={`img-${idx}`}
                                                fill
                                                sizes="(max-width: 600px) 100vw, 400px"
                                                style={{ objectFit: "cover" }}
                                            />
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => removeImageAt(idx)}
                                            className="absolute top-2 right-2 bg-white cursor-pointer text-red-500 rounded-full py-1 px-2 shadow-md opacity-90"
                                            title="Remove image"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="text-gray-500 bg-gray-100 border border-gray-300 rounded-sm h-30 p-6 flex items-center justify-center">
                                    <p>No images uploaded yet.</p>
                                </div>
                            )}
                        </div>

                        {/* hidden file input */}
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleFilesSelected}
                        />

                        <div className="mt-3 flex gap-2 items-center">
                            <Button type="button" onClick={openFilePicker} variant="outlined" disabled={isUploading}>
                                {isUploading ? (
                                    <>
                                        <CircularProgress size={16} sx={{ mr: 1 }} /> Uploading...
                                    </>
                                ) : (
                                    "Upload Images"
                                )}
                            </Button>
                            <FormHelperText>Images are optional</FormHelperText>
                        </div>

                        {errors.images && <FormHelperText>{errors.images.message}</FormHelperText>}
                    </FormControl>

                    {/* Active Switch */}
                    <FormControl margin="normal">
                        <Controller
                            name="active"
                            control={control}
                            render={({ field }) => (
                                <FormControlLabel control={<Switch {...field} checked={field.value} />} label="Active" />
                            )}
                        />
                    </FormControl>
                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button
                        variant="contained"
                        type="submit"
                        disabled={createNewProduct?.isPending || updateProduct?.isPending || isUploading}
                        startIcon={(createNewProduct?.isPending || updateProduct?.isPending) ? <CircularProgress size={18} /> : null}
                    >
                        {initialData ? "Save Changes" : "Save"}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}
