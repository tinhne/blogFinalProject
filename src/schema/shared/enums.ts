import { z } from 'zod';

export const genderEnum = z.enum(['MALE', 'FEMALE', 'UNSPECIFIED']);

// Post status enum
export const postStatusEnum = z.enum(['DRAFT', 'PUBLISHED']);

// Comment status enum
export const postVisibilityEnum = z.enum(['PUBLIC', 'PRIVATE']);

// Export TypeScript type (optional)
export type Gender = z.infer<typeof genderEnum>;
export type PostStatus = z.infer<typeof postStatusEnum>;
export type PostVisibility = z.infer<typeof postVisibilityEnum>;
