import { z } from 'zod';

// Define the Event schema using Zod
export const eventSchema = z.object({
  id: z.union([z.number(), z.string()]).optional(), // Allow id to be string or number
  name: z.string().min(1, 'Event name is required'),
  location: z.string().min(1, 'Location is required'),
  date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid date format',
  }),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
});

export type Event = z.infer<typeof eventSchema>;
