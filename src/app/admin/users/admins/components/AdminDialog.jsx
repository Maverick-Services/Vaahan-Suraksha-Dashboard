"use client";

import React, { useEffect, useState } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, IconButton, FormControl,
    FormHelperText, Box, InputAdornment
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useUsers } from "@/hooks/useUsers";

export default function AdminDialog({ open, onClose, initialData = null }) {
    const { createNewUser, updateUser } = useUsers();
    const [showPassword, setShowPassword] = useState(false);

    const isEdit = Boolean(initialData);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: "",
            email: "",
            phoneNo: "",
            password: "",
            role: "admin",
        },
    });

    useEffect(() => {
        if (initialData) {
            reset({
                name: initialData.name || "",
                email: initialData.email || "",
                phoneNo: initialData.phoneNo || "",
                password: "",
                role: initialData.role || "admin",
            });
        } else {
            reset({
                name: "",
                email: "",
                phoneNo: "",
                password: "",
                role: "admin",
            });
        }
    }, [initialData, open, reset]);

    const onSubmit = async (data) => {
        try {
            if (isEdit) {
                await updateUser.mutateAsync({
                    data: {
                        userId: initialData._id,
                        ...data,
                    },
                });
                onClose();
                return;
            }

            // create admin (force role)
            await createNewUser.mutateAsync({
                data: {
                    ...data,
                    role: "admin",
                },
            });

            onClose();
            reset();
        } catch (err) {
            console.error(err);
        }
    };

    const creating = createNewUser?.isPending;
    const updating = updateUser?.isPending;

    return (
        <Dialog open={!!open} onClose={onClose} fullWidth maxWidth="sm" aria-labelledby="add-admin-dialog">
            <DialogTitle id="add-admin-dialog" className="flex items-center justify-between">
                {isEdit ? "Edit Admin" : "Create New Admin"}
                <IconButton size="small" onClick={onClose} aria-label="close"><CloseIcon fontSize="small" /></IconButton>
            </DialogTitle>

            <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
                <DialogContent dividers>
                    <FormControl fullWidth margin="normal" error={Boolean(errors.name)}>
                        <TextField {...register("name", { required: "Name is required", minLength: { value: 2, message: "Minimum 2 characters" } })} label="Name" error={Boolean(errors.name)} />
                        {errors.name && <FormHelperText>{errors.name.message}</FormHelperText>}
                    </FormControl>

                    <FormControl fullWidth margin="normal" error={Boolean(errors.email)}>
                        <TextField {...register("email", {
                            required: "Email is required",
                            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email address" }
                        })} label="Email" error={Boolean(errors.email)} />
                        {errors.email && <FormHelperText>{errors.email.message}</FormHelperText>}
                    </FormControl>

                    <FormControl fullWidth margin="normal" error={Boolean(errors.phoneNo)}>
                        <TextField {...register("phoneNo", {
                            required: "Phone number is required",
                            pattern: { value: /^\d{10}$/, message: "Phone number must be 10 digits" }
                        })} label="Phone No" error={Boolean(errors.phoneNo)} />
                        {errors.phoneNo && <FormHelperText>{errors.phoneNo.message}</FormHelperText>}
                    </FormControl>

                    {!initialData &&
                        <FormControl fullWidth margin="normal" error={Boolean(errors.password)}>
                            <TextField
                                {...register("password", { required: "Password is required", minLength: { value: 6, message: "Minimum 6 characters" } })}
                                label={isEdit ? "Password (leave blank to keep current)" : "Password"}
                                type={showPassword ? "text" : "password"}
                                error={Boolean(errors.password)}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPassword((s) => !s)} edge="end" size="small">
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            {errors.password && <FormHelperText>{errors.password.message}</FormHelperText>}
                        </FormControl>
                    }

                    <input type="hidden" {...register("role")} />
                    <input type="hidden" {...register("type")} />
                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <LoadingButton
                        variant="contained"
                        type="submit"
                        loading={creating || updating}
                    >
                        {isEdit ? "Save Changes" : "Save"}
                    </LoadingButton>
                </DialogActions>
            </Box>
        </Dialog>
    );
}
