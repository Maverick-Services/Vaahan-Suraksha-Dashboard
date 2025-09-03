import z from "zod";

// Login 
export const LoginPageSchema = z.object({
    email: z.string().email('Invalid email address').min(1, 'Email is required'),
    password: z.string().min(6, 'Password must be at least 6 characters.'),
    role: z.enum(['employee', 'company'])
});

// Brand Schema
export const brandSchema = z.object({
    name: z.string().min(2, "Brand Name is required."),
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
    password: z.string().min(6, 'Please enter a valid password.'),
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
    password: z.string().min(6, 'Please enter a valid password.'),
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
    password: z.string().min(6, 'Please enter a valid password.'),
    role: z.enum(['rider']).default('rider')
    // active: z.boolean().default(true),
});

// User Schema
export const userSchema = z.object({
    name: z.string().min(2, "User Name is required."),
    email: z.string().email('Invalid email address').min(1, 'Email is required'),
    phoneNo: z
        .string()
        .min(10, "Phone number must be at least 10 digits")
        .max(10, "Phone number must be at most 10 digits")
        .regex(/^\d+$/, "Phone number must contain only digits"),
    password: z.string().min(6, 'Please enter a valid password.'),
    role: z.enum(['user']).default('user'),
    type: z.enum(['b2c']).default('b2c')
    // active: z.boolean().default(true),
});

// Car Model Schema
export const carModelSchema = z.object({
    name: z.string().min(2, "Model Name is required."),
    brandId: z.string().min(2, "Brand is required."),
    image: z.string().min(2, "Image is required."),
    active: z.boolean().default(true),
});