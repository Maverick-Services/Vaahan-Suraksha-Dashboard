// app/admin/carModels/components/CarModelDialog.jsx

"use client";

import React, { useEffect, useRef, useState } from "react";
import {
    Dialog, DialogTitle, DialogContent,
    DialogActions, Button, TextField,
    IconButton, FormControl, FormHelperText, Box,
    FormControlLabel, Switch, Select, MenuItem, InputLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { carModelSchema } from "@/lib/validations";
import { useCarModels } from "@/hooks/useCarModels";
import { useBrands } from "@/hooks/useBrands";
import Image from "next/image";
import toast from "react-hot-toast";
import { uploadImage } from "@/lib/services/uploadImage";

export default function AddCarModelDialog({ open, onClose, initialData = null }) {
    // Image uploading 
    const fileInputRef = useRef(null);
    const [isUploading, setIsUploading] = useState(false);
    const [image, setImage] = useState(null)

    const { createNewCarModel } = useCarModels();

    // brand related
    const { brandsQuery } = useBrands();
    const brandsData = brandsQuery({
        page: 1,
        limit: 50,
    });
    const brands = brandsData?.data?.data?.data?.brands || {};

    const {
        register,
        handleSubmit,
        control,
        reset,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(carModelSchema),
        defaultValues: {
            name: "",
            brandId: "",
            image: "",
            active: true,
        },
    });

    useEffect(() => {
        if (initialData) {
            reset({
                name: initialData.name || "",
                brandId: initialData.brand._id || "",
                image: initialData.image || "",
                active: typeof initialData.active === "boolean" ? initialData.active : true,
            });
            setImage(initialData.image || null);
        } else {
            reset({ name: "", image: "", brandId: "", active: true });
            setImage(null);
        }
    }, [initialData, open, reset]);

    const handleImageChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const toastId = toast.loading('Uploading...')
        const reader = new FileReader();
        reader.onloadend = async () => {
            try {
                setIsUploading(true);
                const imageUrl = await uploadImage(reader.result);
                setImage(imageUrl);
                setValue("image", imageUrl);
                toast.success('Image uploaded', { id: toastId });
            } catch (err) {
                console.error(err);
                toast.error('Upload failed', { id: toastId });
            } finally {
                setIsUploading(false);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleImageClick = () => { fileInputRef.current?.click(); };

    const onSubmit = async (data) => {
        console.log("Form Data:", data);
        try {
            const res = await createNewCarModel.mutateAsync({ data })
            console.log(res);
            onClose();
            reset();
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <Dialog
            open={!!open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            aria-labelledby="add-car-dialog"
        >
            <DialogTitle
                id="add-car-dialog"
                className="flex items-center justify-between"
            >
                Create New Car Model
                <IconButton size="small" onClick={onClose} aria-label="close">
                    <CloseIcon fontSize="small" />
                </IconButton>
            </DialogTitle>

            {/* form */}
            <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
                <DialogContent dividers>
                    {/* Name */}
                    <FormControl fullWidth margin="normal" error={Boolean(errors.name)}>
                        <TextField
                            {...register("name")}
                            label="Name"
                            error={Boolean(errors.name)}
                        />
                        {errors.name && (
                            <FormHelperText>{errors.name.message}</FormHelperText>
                        )}
                    </FormControl>

                    {/* Brand Select */}
                    <FormControl
                        fullWidth
                        margin="normal"
                        error={Boolean(errors.brandId)} // error handling
                    >
                        <InputLabel id="brand-select-label">Brand</InputLabel>
                        <Controller
                            name="brandId"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    labelId="brand-select-label"
                                    label='Brand'
                                    {...field}
                                >
                                    {Array.isArray(brands) &&
                                        brands.map((brand) => (
                                            <MenuItem key={brand._id} value={brand._id}>
                                                {brand.name}
                                            </MenuItem>
                                        ))}
                                </Select>
                            )}
                        />
                        {errors.brandId && (
                            <FormHelperText>{errors.brandId.message}</FormHelperText>
                        )}
                    </FormControl>

                    {/* Image Upload */}
                    <FormControl fullWidth margin="normal" error={Boolean(errors.image)}>
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            className="hidden"
                        />

                        {!image ? (
                            <div
                                className="flex-1 border-2 py-10 border-dashed border-gray-300 rounded-sm flex items-center justify-center cursor-pointer"
                                onClick={handleImageClick}
                            >
                                <span className="text-gray-500">Click to select image</span>
                            </div>
                        ) : (
                            <>
                                <div className="h-full w-full border rounded-xl">
                                    <Image
                                        height={100}
                                        width={100}
                                        quality={100}
                                        src={image}
                                        alt="category image"
                                        className="w-full h-44 object-contain"
                                    />
                                </div>
                                <Button
                                    type="button"
                                    onClick={handleImageClick}
                                    className="mt-2">
                                    Change Image
                                </Button>
                            </>
                        )}
                        {errors.image && (
                            <FormHelperText>{errors.image.message}</FormHelperText>
                        )}
                    </FormControl>

                    {/* Active Switch */}
                    <FormControl margin="normal">
                        <Controller
                            name="active"
                            control={control}
                            render={({ field }) => (
                                <FormControlLabel
                                    control={<Switch {...field} checked={field.value} />}
                                    label="Active"
                                />
                            )}
                        />
                    </FormControl>

                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button
                        variant="contained"
                        type="submit"
                        loading={createNewCarModel?.isPending}
                        disabled={isUploading}>
                        Save
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}
