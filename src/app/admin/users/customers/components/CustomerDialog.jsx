"use client";

import React, { useEffect, useState } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, IconButton, FormControl,
    FormHelperText, Box, InputAdornment
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserSchema, updateUserSchema } from "@/lib/validations"; // see note
import { useUsers } from "@/hooks/useUsers";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function CustomerDialog({ open, onClose, initialData = null }) {
    const { createNewUser, updateUser } = useUsers();
    const [showPassword, setShowPassword] = useState(false);

    // choose schema based on mode (create vs edit)
    const isEdit = Boolean(initialData);
    const resolverSchema = isEdit ? updateUserSchema : createUserSchema;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(resolverSchema),
        defaultValues: {
            name: "",
            email: "",
            phoneNo: "",
            password: "",
            role: "user",
            type: "b2c",
        },
    });

    useEffect(() => {
        if (initialData) {
            reset({
                name: initialData.name || "",
                email: initialData.email || "",
                phoneNo: initialData.phoneNo || "",
                password: "",
                role: initialData.role || "user",
                type: initialData.type || "b2c",
            });
        } else {
            reset({
                name: "",
                email: "",
                phoneNo: "",
                password: "",
                role: "user",
                type: "b2c",
            });
        }
    }, [initialData, open, reset]);

    const onSubmit = async (data) => {
        try {
            if (isEdit) {
                // update payload — adapt shape if your backend expects different
                await updateUser.mutateAsync({
                    userId: initialData._id,
                    data,
                });
                onClose();
                return;
            }

            // create
            await createNewUser.mutateAsync({ data });
            onClose();
            reset();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Dialog open={!!open} onClose={onClose} fullWidth maxWidth="sm" aria-labelledby="add-customer-dialog">
            <DialogTitle id="add-customer-dialog" className="flex items-center justify-between">
                {isEdit ? "Edit Customer" : "Create New Customer"}
                <IconButton size="small" onClick={onClose} aria-label="close"><CloseIcon fontSize="small" /></IconButton>
            </DialogTitle>

            <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
                <DialogContent dividers>
                    <FormControl fullWidth margin="normal" error={Boolean(errors.name)}>
                        <TextField {...register("name")} label="Name" error={Boolean(errors.name)} />
                        {errors.name && <FormHelperText>{errors.name.message}</FormHelperText>}
                    </FormControl>

                    <FormControl fullWidth margin="normal" error={Boolean(errors.email)}>
                        <TextField {...register("email")} label="Email" error={Boolean(errors.email)} />
                        {errors.email && <FormHelperText>{errors.email.message}</FormHelperText>}
                    </FormControl>

                    <FormControl fullWidth margin="normal" error={Boolean(errors.phoneNo)}>
                        <TextField {...register("phoneNo")} label="Phone No" error={Boolean(errors.phoneNo)} />
                        {errors.phoneNo && <FormHelperText>{errors.phoneNo.message}</FormHelperText>}
                    </FormControl>

                    {!initialData &&
                        <FormControl fullWidth margin="normal" error={Boolean(errors.password)}>
                            <TextField
                                {...register("password")}
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
                    <Button
                        variant="contained"
                        type="submit"
                        disabled={createNewUser?.isPending || updateUser?.isPending}
                        loading={createNewUser?.isPending || updateUser?.isPending}
                    >
                        {isEdit ? "Save Changes" : "Save"}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}
