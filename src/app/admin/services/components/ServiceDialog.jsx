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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { serviceSchema } from "@/lib/validations";
import Image from "next/image";
import toast from "react-hot-toast";
import { uploadImage } from "@/lib/services/uploadImage";
import { useServices } from "@/hooks/useServices";

export default function ServiceDialog({ open, onClose, initialData = null }) {
    const fileInputRef = useRef(null);
    const { createNewService, updateService } = useServices();

    const [images, setImages] = useState([]);
    const {
        register,
        handleSubmit,
        control,
        reset,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(serviceSchema),
        defaultValues: {
            name: "",
            images: [],
            active: true,
        },
    });

    // Initialize/reset form when open or initialData changes
    useEffect(() => {
        if (initialData) {
            // if editing, populate fields
            const initImages = Array.isArray(initialData.images) ? initialData.images : [];
            reset({
                name: initialData.name || "",
                images: initImages,
                active: typeof initialData.active === "boolean" ? initialData.active : true,
            });
            setImages(initImages);
        } else {
            reset({ name: "", images: [], active: true });
            setImages([]);
        }
    }, [initialData, open, reset]);

    // Keep form value in sync with local images state
    useEffect(() => {
        setValue("images", images, { shouldValidate: true });
    }, [images, setValue]);

    const onSubmit = async (data) => {
        try {
            // If initialData exists, we are in Edit mode — per your request DO NOT call edit API now.
            if (initialData) {
                await updateService.mutateAsync({
                    serviceId: initialData?._id,
                    ...data
                });
                // console.log("Edit submit (no API call):", {
                //     serviceId: initialData?._id,
                //     ...data
                // });
                // toast.success("Service data ready (edit not applied - as requested).");

                onClose();
                return;
            }

            // Create mode: call create mutation
            await createNewService.mutateAsync({ data });
            onClose();
            reset();
        } catch (error) {
            console.error(error);
        }
    };

    const handleFilesSelected = async (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const toastId = toast.loading("Uploading images...");
        const urls = [];

        // sequential upload (safer) — you can parallelize if you want (Promise.all)
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            try {
                const reader = new FileReader();
                const result = await new Promise((resolve, reject) => {
                    reader.onloadend = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });

                const url = await uploadImage(result);
                urls.push(url);
            } catch (err) {
                console.error("Image upload failed", err);
                // continue uploading remaining images
            }
        }

        // append uploaded urls to images state
        setImages((prev) => [...prev, ...urls]);

        toast.success("Images uploaded", { id: toastId });
        e.target.value = "";
    };

    const removeImageAt = (index) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleOpenFilePicker = () => fileInputRef.current?.click();

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
                            {images?.map((url, idx) => (
                                <div key={url + idx} className="relative group rounded overflow-hidden">
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
                            ))}
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
                                onClick={handleOpenFilePicker}
                                className="mt-2"
                                variant="outlined"
                            >
                                Upload Images
                            </Button>

                            {/* <Button
                                type="button"
                                onClick={() => {
                                    // quick clear all images
                                    setImages([]);
                                }}
                                className="mt-2"
                                color="secondary"
                            >
                                Clear Images
                            </Button> */}
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
                        disabled={createNewService?.isPending}
                        loading={createNewService?.isPending}
                    >
                        {initialData ? "Save Changes" : "Save"}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}
