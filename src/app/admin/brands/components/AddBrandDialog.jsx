"use client";

import React, { useRef, useState, useEffect } from "react";
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
    Switch,
    FormControlLabel,
    Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { brandSchema } from "@/lib/validations";
import toast from "react-hot-toast";
import { uploadImage } from "@/lib/services/uploadImage";
import Image from "next/image";
import { useBrands } from "@/hooks/useBrands";

export default function AddBrandDialog({ open, onClose, initialData = null }) {
    // Image uploading 
    const fileInputRef = useRef(null);
    const [isUploading, setIsUploading] = useState(false);
    const [image, setImage] = useState(initialData?.image || null);

    const { createNewBrand, updateBrand } = useBrands();

    const {
        register,
        handleSubmit,
        control,
        reset,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(brandSchema),
        defaultValues: {
            name: "",
            image: "",
            active: true,
        },
    });

    useEffect(() => {
        if (initialData) {
            reset({
                name: initialData.name || "",
                image: initialData.image || "",
                active: typeof initialData.active === "boolean" ? initialData.active : true,
            });
            setImage(initialData.image || null);
        } else {
            reset({ name: "", image: "", active: true });
            setImage(null);
        }
    }, [initialData, open, reset]);

    const handleImageChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const toastId = toast.loading("Uploading...");
        const reader = new FileReader();
        reader.onloadend = async () => {
            try {
                setIsUploading(true);
                const imageUrl = await uploadImage(reader.result);
                setImage(imageUrl);
                setValue("image", imageUrl);
                toast.success("Image uploaded", { id: toastId });
            } catch (err) {
                console.error(err);
                toast.error("Upload failed", { id: toastId });
            } finally {
                setIsUploading(false);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleImageClick = () => fileInputRef.current?.click();

    const onSubmit = async (data) => {
        try {
            if (initialData && initialData._id) {
                // Edit mode
                // await updateBrand.mutateAsync({ id: initialData._id, data });
                console.log('abc')
            } else {
                // Create mode
                await createNewBrand.mutateAsync({ data });
            }
            reset();
        } catch (err) {
            console.error(err);
            toast.error("Save failed");
        }
    };

    const isSubmitting = isUploading || createNewBrand?.isLoading || updateBrand?.isLoading;

    return (
        <Dialog open={!!open} onClose={onClose} fullWidth maxWidth="sm" aria-labelledby="add-brand-dialog">
            <DialogTitle id="add-brand-dialog" className="flex items-center justify-between">
                {initialData ? "Edit Brand" : "Add New Brand"}
                <IconButton size="small" onClick={onClose} aria-label="close">
                    <CloseIcon fontSize="small" />
                </IconButton>
            </DialogTitle>

            <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
                <DialogContent dividers>
                    <FormControl fullWidth margin="normal" error={Boolean(errors.name)}>
                        <TextField {...register("name")} label="Brand Name" error={Boolean(errors.name)} />
                        {errors.name && <FormHelperText>{errors.name.message}</FormHelperText>}
                    </FormControl>

                    <FormControl fullWidth margin="normal" error={Boolean(errors.image)}>
                        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
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
                                    <Image height={100} width={100} quality={100} src={image} alt="category image" className="w-full h-44 object-contain" />
                                </div>
                                <Button type="button" onClick={handleImageClick} className="mt-2">Change Image</Button>
                            </>
                        )}
                        {errors.image && <FormHelperText>{errors.image.message}</FormHelperText>}
                    </FormControl>

                    <FormControl margin="normal">
                        <Controller
                            name="active"
                            control={control}
                            render={({ field }) => <FormControlLabel control={<Switch {...field} checked={field.value} />} label="Active" />}
                        />
                    </FormControl>
                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button variant="contained" type="submit" disabled={isSubmitting}>
                        {initialData ? (isSubmitting ? "Saving..." : "Save Changes") : (isSubmitting ? "Saving..." : "Save")}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}
