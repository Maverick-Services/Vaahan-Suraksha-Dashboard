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
import { riderSchema } from "@/lib/validations";
import { useUsers } from "@/hooks/useUsers";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";

export default function AddRiderDialog({ open, onClose, initialData = null }) {
    const { createNewRider, updateUser } = useUsers();
    const [showPassword, setShowPassword] = useState(false);

    const isEdit = Boolean(initialData);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(riderSchema),
        defaultValues: {
            name: "",
            email: "",
            phoneNo: "",
            password: "",
            role: "rider",
        },
    });

    useEffect(() => {
        if (initialData) {
            reset({
                name: initialData.name || "",
                email: initialData.email || "",
                phoneNo: initialData.phoneNo || "",
                password: "",
                role: initialData.role || "rider",
            });
        } else {
            reset({
                name: "",
                email: "",
                phoneNo: "",
                password: "",
                role: "rider",
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

            await createNewRider.mutateAsync({ data });
            onClose();
            reset();
        } catch (err) {
            console.error(err);
        }
    };

    const creating = createNewRider?.isPending;
    const updating = updateUser?.isPending;

    return (
        <Dialog open={!!open} onClose={onClose} fullWidth maxWidth="sm" aria-labelledby="add-rider-dialog">
            <DialogTitle id="add-rider-dialog" className="flex items-center justify-between">
                {isEdit ? "Edit Rider" : "Create New Rider"}
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
                                            <IconButton onClick={() => setShowPassword(s => !s)} edge="end" size="small">
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
                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <LoadingButton variant="contained" type="submit" loading={creating || updating}>
                        {isEdit ? "Save Changes" : "Save"}
                    </LoadingButton>
                </DialogActions>
            </Box>
        </Dialog>
    );
}
