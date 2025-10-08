"use client";
import React, { useEffect } from "react";
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
    CircularProgress,
    Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Checkbox from "@mui/material/Checkbox";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { oneTimePlanSchema } from "@/lib/validations";
import { useOneTimePlans } from "@/hooks/useOneTimePlans";
import { useServices } from "@/hooks/useServices";
import toast from "react-hot-toast";
import { CAR_TYPES } from "@/lib/constants";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function OtpDialog({ open, onClose, initialData = null }) {
    const { createOneTimePlan, updateOneTimePlan } = useOneTimePlans();
    const { servicesQuery } = useServices();

    // load services options (same pattern as product dialog's brand/service load)
    const servicesResult = servicesQuery ? servicesQuery({ page: 1, limit: 300 }) : { data: null, isLoading: false };
    const services = servicesResult?.data?.data?.data?.services || [];

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
        resolver: zodResolver(oneTimePlanSchema),
        defaultValues: {
            name: "",
            services: [], // will contain array of IDs (strings)
            pricing: {},
            active: true,
        },
    });
    console.log(errors)
    // Prefill on edit:
    useEffect(() => {
        if (initialData) {
            // Extract service IDs from initialData.services (could be array of ids or objects)
            const serviceIds = Array.isArray(initialData.services)
                ? initialData.services.map((s) => (typeof s === "string" ? s : s._id || s.id || "")).filter(Boolean)
                : [];

            // build pricing mapping
            const pricingObj = initialData.pricing || {};
            const pricing = {};
            CAR_TYPES.forEach((ct) => {
                pricing[ct.key] =
                    pricingObj?.[ct.key] ?? pricingObj?.[ct.key.toLowerCase?.()] ?? pricingObj?.[ct.label] ?? "";
            });

            reset({
                name: initialData.name || "",
                services: serviceIds,
                pricing,
                active: typeof initialData.active === "boolean" ? initialData.active : true,
            });
        } else {
            reset({ name: "", services: [], pricing: {}, active: true });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialData, open, reset]);

    const isMutating = createOneTimePlan.isPending || updateOneTimePlan.isPending;

    const onSubmit = async (formData) => {
        try {
            // formData.services is already array of IDs (strings) now
            const servicesArr = Array.isArray(formData.services) ? formData.services : [];

            const pricingPayload = {};
            CAR_TYPES.forEach((ct) => {
                const val = (formData.pricing && formData.pricing[ct.key]) ?? undefined;
                if (val !== undefined && val !== "" && !isNaN(Number(val))) {
                    pricingPayload[ct.key] = Number(val);
                }
            });

            const payload = {
                name: formData.name?.trim(),
                active: !!formData.active,
                services: servicesArr,
                pricing: Object.keys(pricingPayload).length > 0 ? pricingPayload : {},
            };

            if (initialData && initialData._id) {
                await updateOneTimePlan.mutateAsync({ data: { ...payload, planId: initialData._id } });
                onClose();
                return;
            }

            await createOneTimePlan.mutateAsync({ data: payload });
            reset();
            onClose();
        } catch (err) {
            console.error("Failed to save one-time plan", err);
            toast.error(err?.response?.data?.message || err?.message || "Failed to save plan");
        }
    };

    // watch pricing for controlled inputs
    const pricingWatch = watch("pricing") || {};

    return (
        <Dialog open={!!open} onClose={onClose} fullWidth maxWidth="sm" aria-labelledby="otp-dialog">
            <DialogTitle id="otp-dialog" className="flex items-center justify-between">
                {initialData ? "Edit One-time Plan" : "Create One-time Plan"}
                <IconButton size="small" onClick={onClose} aria-label="close">
                    <CloseIcon fontSize="small" />
                </IconButton>
            </DialogTitle>

            <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
                <DialogContent dividers>
                    {/* Name */}
                    <FormControl fullWidth margin="normal" error={Boolean(errors.name)}>
                        <TextField {...register("name")} label="Plan name" size="small" />
                        {errors.name && <FormHelperText>{errors.name.message}</FormHelperText>}
                    </FormControl>

                    {/* Services Autocomplete:
              - Autocomplete value uses option objects for display.
              - Form stores only array of IDs (strings) via field.onChange([...ids]).
          */}
                    <FormControl fullWidth margin="normal" error={Boolean(errors.services)}>
                        <Controller
                            name="services"
                            control={control}
                            render={({ field }) => {
                                // field.value is array of IDs (strings)
                                const selectedOptions = Array.isArray(field.value) && field.value.length > 0
                                    ? services.filter((svc) => field.value.includes(svc._id || svc.id || svc))
                                    : [];

                                return (
                                    <Autocomplete
                                        multiple
                                        options={services || []}
                                        disableCloseOnSelect
                                        getOptionLabel={(option) => option?.name || option}
                                        value={selectedOptions}
                                        onChange={(_, newOptions) => {
                                            // store only IDs in the form state
                                            const ids = (newOptions || []).map((o) => (o._id || o.id || o));
                                            field.onChange(ids);
                                        }}
                                        isOptionEqualToValue={(opt, val) => (opt._id || opt.id || opt) === (val._id || val.id || val)}
                                        renderOption={(props, option, { selected }) => (
                                            // don't add extra key here; props contains key
                                            <li {...props}>
                                                <Checkbox
                                                    icon={icon}
                                                    checkedIcon={checkedIcon}
                                                    style={{ marginRight: 8 }}
                                                    checked={selected}
                                                />
                                                {option.name || option}
                                            </li>
                                        )}
                                        renderInput={(params) => <TextField {...params} label="Services" placeholder="Select services" size="small" />}
                                    />
                                );
                            }}
                        />
                        {/* show zod error if any */}
                        {errors.services && (
                            <FormHelperText>
                                {typeof errors.services?.message === "string"
                                    ? errors.services.message
                                    : "Invalid services selection"}
                            </FormHelperText>
                        )}
                    </FormControl>

                    {/* Pricing inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                        {CAR_TYPES.map((ct) => (
                            <FormControl key={ct.key} fullWidth margin="normal">
                                <TextField
                                    label={`${ct.label} Price`}
                                    size="small"
                                    type="number"
                                    inputProps={{ min: 0, step: "0.01" }}
                                    value={pricingWatch?.[ct.key] ?? ""}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        const current = getValues("pricing") || {};
                                        setValue("pricing", {
                                            ...current,
                                            [ct.key]: val === "" ? "" : Number(val)
                                        }, {
                                            shouldValidate: true,
                                            shouldDirty: true
                                        });
                                    }}
                                    error={Boolean(errors.pricing?.[ct.key])}
                                    helperText={errors.pricing?.[ct.key]?.message}
                                />
                            </FormControl>
                        ))}
                    </div>

                    {/* Active switch */}
                    <FormControl margin="normal">
                        <Controller
                            name="active"
                            control={control}
                            render={({ field }) => <FormControlLabel control={<Switch {...field} checked={!!field.value} />} label="Active" />}
                        />
                    </FormControl>

                    {initialData ? (
                        <>
                            <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                                Current data preview
                            </Typography>
                            <pre style={{ fontSize: 12, whiteSpace: "pre-wrap" }}>{JSON.stringify(initialData, null, 2)}</pre>
                        </>
                    ) : null}
                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose} disabled={isMutating}>Cancel</Button>
                    <Button variant="contained" type="submit" disabled={isMutating} startIcon={isMutating ? <CircularProgress size={18} /> : null}>
                        {initialData ? "Save Changes" : "Save"}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}
