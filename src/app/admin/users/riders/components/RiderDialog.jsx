"use client";

import React, { useState } from "react";
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
    InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { riderSchema } from "@/lib/validations";
import { useUsers } from "@/hooks/useUsers";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function AddRiderDialog({ open, onClose }) {

    const { createNewRider } = useUsers();
    const [showPassword, setShowPassword] = useState(false)

    const {
        register,
        handleSubmit,
        control,
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

    const onSubmit = async (data) => {
        console.log("Form Data:", data);
        try {
            const res = await createNewRider.mutateAsync({ data })
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
            aria-labelledby="add-rider-dialog"
        >
            <DialogTitle
                id="add-rider-dialog"
                className="flex items-center justify-between"
            >
                Create New Rider
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

                    {/* Email */}
                    <FormControl fullWidth margin="normal" error={Boolean(errors.name)}>
                        <TextField
                            {...register("email")}
                            label="Email"
                            error={Boolean(errors.email)}
                        />
                        {errors.email && (
                            <FormHelperText>{errors.email.message}</FormHelperText>
                        )}
                    </FormControl>

                    {/* Name */}
                    <FormControl fullWidth margin="normal" error={Boolean(errors.name)}>
                        <TextField
                            {...register("phoneNo")}
                            label="Phone No"
                            error={Boolean(errors.phoneNo)}
                        />
                        {errors.phoneNo && (
                            <FormHelperText>{errors.phoneNo.message}</FormHelperText>
                        )}
                    </FormControl>

                    {/* Password */}
                    <FormControl fullWidth margin="normal" error={Boolean(errors.name)}>
                        <TextField
                            {...register("password")}
                            label="Password"
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            error={Boolean(errors.password)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label={showPassword ? 'hide the password' : 'display the password'}
                                            onClick={() => setShowPassword((s) => !s)}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        {errors.password && (
                            <FormHelperText>{errors.password.message}</FormHelperText>
                        )}
                    </FormControl>

                    {/* Active Switch */}
                    {/* <FormControl margin="normal">
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
                    </FormControl> */}
                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button variant="contained" type="submit" loading={createNewRider?.isPending}>
                        Save
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}
