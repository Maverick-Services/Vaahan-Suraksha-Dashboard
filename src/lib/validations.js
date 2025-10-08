// app/lib/validations.js
import z from "zod";
import { CAR_TYPES } from "./constants";

// Login 
export const LoginPageSchema = z.object({
    email: z.string().email('Invalid email address').min(1, 'Email is required'),
    password: z.string().min(6, 'Password must be at least 6 characters.'),
    role: z.enum(['employee', 'company'])
});

// Brand Schema
export const brandSchema = z.object({
    name: z.string().min(2, "Brand Name is required."),
    image: z.string().min(2, "Image is required."),
    active: z.boolean().default(true),
});

// Employee Schema
export const employeeSchema = z.object({
    name: z.string().min(2, "Employee Name is required."),
    email: z.string().email('Invalid email address').min(1, 'Email is required'),
    phoneNo: z
        .string()
        .min(10, "Phone number must be at least 10 digits")
        .max(10, "Phone number must be at most 10 digits")
        .regex(/^\d+$/, "Phone number must contain only digits"),
    // password: z.string().min(6, 'Please enter a valid password.'),
    password: z.string().optional(),
    role: z.enum(['employee']).default('employee')
    // active: z.boolean().default(true),
});

// Company Schema
export const companySchema = z.object({
    name: z.string().min(2, "Company Name is required."),
    email: z.string().email('Invalid email address').min(1, 'Email is required'),
    phoneNo: z
        .string()
        .min(10, "Phone number must be at least 10 digits")
        .max(10, "Phone number must be at most 10 digits")
        .regex(/^\d+$/, "Phone number must contain only digits"),
    // password: z.string().min(6, 'Please enter a valid password.'),
    password: z.string().optional(),
    role: z.enum(['company']).default('company')
    // active: z.boolean().default(true),
});

// Rider Schema
export const riderSchema = z.object({
    name: z.string().min(2, "Rider Name is required."),
    email: z.string().email('Invalid email address').min(1, 'Email is required'),
    phoneNo: z
        .string()
        .min(10, "Phone number must be at least 10 digits")
        .max(10, "Phone number must be at most 10 digits")
        .regex(/^\d+$/, "Phone number must contain only digits"),
    password: z.string().optional(),
    // password: z.string().min(6, 'Please enter a valid password.'),
    role: z.enum(['rider']).default('rider')
    // active: z.boolean().default(true),
});

// Create customer (password required)
export const createUserSchema = z.object({
    name: z.string().min(2, "User Name is required."),
    email: z.string().email("Invalid email address").min(1, "Email is required"),
    phoneNo: z.string().min(10, "Phone number must be at least 10 digits").max(10, "Phone number must be at most 10 digits").regex(/^\d+$/, "Phone number must contain only digits"),
    password: z.string().min(6, "Please enter a valid password."),
    role: z.enum(["user"]).default("user"),
    type: z.enum(["b2c"]).default("b2c"),
});

// Update customer (password optional)
export const updateUserSchema = z.object({
    name: z.string().min(2, "User Name is required."),
    email: z.string().email("Invalid email address").min(1, "Email is required"),
    phoneNo: z.string().min(10, "Phone number must be at least 10 digits").max(10, "Phone number must be at most 10 digits").regex(/^\d+$/, "Phone number must contain only digits"),
    password: z.preprocess((v) => (v === "" ? undefined : v), z.string().min(6, "Please enter a valid password").optional()).optional(),
    role: z.enum(["user"]).default("user"),
    type: z.enum(["b2c"]).default("b2c"),
});


// Car Model Schema
export const carModelSchema = z.object({
    name: z.string().min(2, "Model Name is required."),
    brandId: z.string().min(2, "Brand is required."),
    image: z.string().min(2, "Image is required."),
    active: z.boolean().default(true),
});

// Service Schema
export const serviceSchema = z.object({
    name: z.string().min(2, "Model Name is required."),
    active: z.boolean().default(true),
    images: z.array(z.string()).min(1, "Image is required."),

})

// Products Schema
export const productSchema = z.object({
    name: z.string().min(2, "Product name is required."),
    description: z.string().optional().nullable(),
    brandId: z.string().optional().nullable(),
    carModelId: z.string().optional().nullable(),
    sku: z.string().optional().nullable(),
    hsn: z.string().optional().nullable(),
    gst: z
        .preprocess((v) => {
            if (v === "" || v === null || v === undefined) return 0;
            if (typeof v === "string" && !isNaN(Number(v))) return Number(v);
            return v;
        }, z.number().min(0, "GST cannot be negative.").optional().default(0)),
    regularPrice: z
        .preprocess((v) => (v === "" ? undefined : Number(v)), z.number().nonnegative().default(0))
        .optional(),
    sellingPrice: z
        .preprocess((v) => (v === "" ? undefined : Number(v)), z.number().nonnegative().default(0))
        .optional(),
    images: z.array(z.string()).optional().default([]),
    active: z.boolean().default(true),
});

// product stock schema
export const stockSchema = z.object({
    vendor: z.string().optional().nullable(),
    purchasePrice: z
        .preprocess((v) => (v === "" ? undefined : Number(v)), z.number().nonnegative().default(0))
        .optional(),
    quantity: z.preprocess(
        (v) => {
            if (v === "" || v === null || v === undefined) return 0;
            if (typeof v === "string" && !isNaN(Number(v))) return Number(v);
            return v;
        },
        z
            .number({
                required_error: "Quantity is required",
                invalid_type_error: "Quantity must be a number",
            })
            .refine((val) => val !== 0, { message: "Quantity cannot be zero" })
    ),
});


// One-time Plan Schema - DYNAMIC VERSION
export const oneTimePlanSchema = z.object({
    name: z.string().min(2, "Plan name is required."),
    services: z.array(z.string()).optional().default([]),
    pricing: z.object(
        CAR_TYPES.reduce((acc, carType) => {
            acc[carType.key] = z.union([z.number(), z.string()])
                .optional()
                .transform(val => val === "" ? undefined : Number(val));
            return acc;
        }, {})
    ).optional().default({}),
    active: z.boolean().default(true),
});