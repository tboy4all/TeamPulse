import { z } from 'zod'

/**
 * TEAM SCHEMAS
 */
export const createTeamSchema = z.object({
  name: z.string().min(1, 'Team name is required').max(255),
})

export const updateTeamSchema = z.object({
  name: z.string().min(1).max(255).optional(),
})

/**
 * USER SCHEMAS
 */
export const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  email: z.string().email('Valid email required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const updateUserSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
})

/**
 * SENTIMENT SCHEMAS
 */
export const addSentimentSchema = z.object({
  value: z.enum(['HAPPY', 'NEUTRAL', 'SAD']),
  userId: z.string().min(1, 'User ID is required'),
  teamId: z.string().min(1, 'Team ID is required'),
})

export const updateSentimentSchema = z.object({
  value: z.enum(['HAPPY', 'NEUTRAL', 'SAD']),
})

/**
 * SETTINGS SCHEMAS
 */

export const updateAppSettingsSchema = z.object({
  checkInsEnabled: z.boolean({
    required_error: 'checkInsEnabled is required',
    invalid_type_error: 'checkInsEnabled must be a boolean',
  }),
  checkInFrequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY'], {
    required_error: 'checkInFrequency is required',
    invalid_type_error: 'Invalid frequency value',
  }),
})
