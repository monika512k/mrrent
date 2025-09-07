import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .email('Please enter a valid email'),
  password: z.string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 8 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .email('Please enter a valid email'),
  password: z.string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
  profile: z.object({
    phone_number: z.string()
      .min(1, 'Phone number is required'),
    phone_country_code: z.string()
      .min(1, 'Country code is required'),
    first_name: z.string()
      .min(1, 'First name is required'),
    last_name: z.string()
      .min(1, 'Last name is required'),
    gender: z.enum(['Male', 'Female']),
    address: z.string()
      .min(1, 'Address is required'),
  }),
});

export type SignupFormData = z.infer<typeof signupSchema>; 