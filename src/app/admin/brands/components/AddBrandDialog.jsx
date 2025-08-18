"use client";

import React from "react";
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
import { useBrands } from "@/hooks/useBrands";
import { brandSchema } from "@/lib/validations";

export default function AddBrandDialog({ open, onClose }) {

    const { createNewBrand } = useBrands();

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(brandSchema),
        defaultValues: {
            name: "",
            active: true,
        },
    });

    const onSubmit = async (data) => {
        console.log("Form Data:", data);
        try {
            const res = await createNewBrand.mutateAsync({ data })
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
            aria-labelledby="add-brand-dialog"
        >
            <DialogTitle
                id="add-brand-dialog"
                className="flex items-center justify-between"
            >
                Add New Brand
                <IconButton size="small" onClick={onClose} aria-label="close">
                    <CloseIcon fontSize="small" />
                </IconButton>
            </DialogTitle>

            {/* ✅ Make whole content a form */}
            <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
                <DialogContent dividers>
                    {/* Brand Name */}
                    <FormControl fullWidth margin="normal" error={Boolean(errors.name)}>
                        <TextField
                            {...register("name")}
                            label="Brand Name"
                            error={Boolean(errors.name)}
                        />
                        {errors.name && (
                            <FormHelperText>{errors.name.message}</FormHelperText>
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
                    <Button variant="contained" type="submit" loading={createNewBrand?.isPending}>
                        Save
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}
