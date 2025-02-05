import { z, ZodType } from 'zod';

export class UserValidation {
    static readonly REGISTER: ZodType = z.object({
        username: z.string().min(4).max(100),
        password: z.string().min(4).max(100),
        name: z.string().min(4).max(100),
    });

    static readonly LOGIN: ZodType = z.object({
        username: z.string().min(4).max(100),
        password: z.string().min(4).max(100),
    });

    static readonly UPDATE: ZodType = z
        .object({
            name: z.string().min(4).max(100).optional(),
            password: z.string().min(4).max(100).optional(),
        })
        .refine((data) => data.name || data.password, {
            message: 'At least one field (name or password) must be provided',
        });
}
