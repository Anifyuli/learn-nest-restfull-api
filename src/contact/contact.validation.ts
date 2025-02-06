import { z, ZodType } from 'zod';

export class ContactValidation {
    static readonly CREATE: ZodType = z.object({
        first_name: z.string().min(2).max(100),
        last_name: z.string().min(2).max(100).optional(),
        email: z.string().min(3).max(100).email().optional(),
        phone: z.string().min(6).max(20).optional(),
    });

    static readonly UPDATE: ZodType = z.object({
        id: z.number().positive(),
        first_name: z.string().min(2).max(100),
        last_name: z.string().min(2).max(100).optional(),
        email: z.string().min(3).max(100).email().optional(),
        phone: z.string().min(6).max(20).optional(),
    });

    static readonly SEARCH: ZodType = z.object({
        name: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        page: z.number().positive(),
        size: z.number().positive(),
    });
}
