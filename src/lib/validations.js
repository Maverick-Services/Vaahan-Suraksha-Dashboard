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