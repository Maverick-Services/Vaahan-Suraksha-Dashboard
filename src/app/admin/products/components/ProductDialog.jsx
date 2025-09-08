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
            // name: "",
            // brandId: "",
            // image: "",
            // active: true,
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
                Create Product
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
                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button
                        variant="contained"
                    // type="submit"
                    // loading={createNewCarModel?.isPending}
                    // disabled={isUploading}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}
