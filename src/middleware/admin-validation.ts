import { z } from 'zod';

export const setupSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  password: z.string().min(12).max(128),
});

export const loginSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(128),
});

export const settingsSchema = z.object({
  businessName: z.string().trim().max(160).optional(),
  businessEmail: z.string().trim().email().max(254).optional().or(z.literal('')),
  businessPhone: z.string().trim().max(40).optional(),
  whatsappNumber: z.string().trim().max(40).optional(),
  address: z.string().trim().max(300).optional(),
  responseMessage: z.string().trim().max(2000).optional(),
  businessHours: z.string().trim().max(300).optional(),
  bankName: z.string().trim().max(160).optional(),
  accountName: z.string().trim().max(160).optional(),
  accountNumber: z.string().trim().max(100).optional(),
  swiftCode: z.string().trim().max(50).optional(),
  paymentInstructions: z.string().trim().max(2000).optional(),
});
