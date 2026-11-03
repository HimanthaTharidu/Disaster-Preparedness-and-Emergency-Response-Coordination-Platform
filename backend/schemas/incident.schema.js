import { z } from 'zod';

export const incidentQuerySchema = z.object({
  status: z.enum(['new', 'verified', 'assigned', 'resolved']).optional(),
  priority: z.enum(['critical', 'high', 'medium', 'low']).optional(),
});
