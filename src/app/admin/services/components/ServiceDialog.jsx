"use client";

import React, { useEffect, useRef, useState } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, IconButton, FormControl,
    FormHelperText, Box, FormControlLabel, Switch,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { serviceSchema } from "@/lib/validations";
import Image from "next/image";
import toast from "react-hot-toast";
import { uploadImage2 } from "@/lib/services/uploadImage";
import { useServices } from "@/hooks/useServices";

export default function ServiceDialog({ open, onClose, initialData = null }) {
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false)
    const { createNewService, updateService } = useServices();

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
        resolver: zodResolver(serviceSchema),
        defaultValues: {
            name: "",
            images: [],
            active: true,
        },
    });

    useEffect(() => {
        if (initialData) {
            const initImages = Array.isArray(initialData.images) ? initialData.images : [];
            reset({
                name: initialData.name || "",
                images: initImages,
                active: typeof initialData?.active === "boolean" ? initialData?.active : true,
            });
        } else {
            reset({ name: "", images: [], active: true });
        }
    }, [initialData, open, reset]);

    const images = watch("images") || [];

    const onSubmit = async (data) => {
        try {
            // create new
            if (initialData) {
                await updateService.mutateAsync({
                    serviceId: initialData?._id,
                    ...data
                });

                onClose();
                return;
            }
            // Edit
            await createNewService.mutateAsync({ data });
            onClose();
            reset();
        } catch (error) {
            console.error(error);
        }
    };

    // Upload Images
    const handleFilesSelected = async (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const toastId = toast.loading("Uploading images...");
        const uploadedUrls = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            try {
                setUploading(true)
                const url = await uploadImage2(file);
                if (url) uploadedUrls.push(url);
            } catch (err) {
                console.error("Image upload failed:", err);
            } finally {
                setUploading(false)
            }
        }

        const existing = getValues("images") || [];
        setValue("images", [...existing, ...uploadedUrls], { shouldValidate: true });
        toast.success("Images uploaded", { id: toastId });

        e.target.value = "";
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
            aria-labelledby="add-Service-dialog"
        >
            <DialogTitle
                id="add-Service-dialog"
                className="flex items-center justify-between"
            >
                {initialData ? "Edit Service" : "Create Service"}
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

                    {/* Images */}
                    <FormControl fullWidth margin="normal" error={Boolean(errors.images)}>
                        <p className="mb-2">Images</p>

                        {/* previews */}
                        <div className="grid grid-cols-1 gap-3">
                            {Array.isArray(images) && images.length > 0 ? (
                                images.map((url, idx) => (
                                    <div key={`${url}-${idx}`} className="relative group rounded overflow-hidden">
                                        <div style={{ position: 'relative', width: '100%', height: 220 }}>
                                            <Image
                                                src={url}
                                                alt={`img-${idx}`}
                                                fill
                                                sizes="(max-width: 600px) 100vw, 400px"
                                                style={{ objectFit: 'cover' }}
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
                                    <p>
                                        No images uploaded yet.
                                    </p>
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

                        <div className="mt-3 flex gap-2">
                            <Button
                                type="button"
                                onClick={openFilePicker}
                                variant="outlined"
                            >
                                Upload Images
                            </Button>
                        </div>

                        {errors.images && (
                            <FormHelperText>{errors.images.message}</FormHelperText>
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
                        disabled={createNewService?.isPending || uploading}
                        loading={createNewService?.isPending}
                    >
                        {initialData ? "Save Changes" : "Save"}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}
