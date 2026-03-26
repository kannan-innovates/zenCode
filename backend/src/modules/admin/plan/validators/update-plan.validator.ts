import { z } from "zod";

const featureSchema = z.object({
     name: z.string().min(1, 'Feature name is required'),
     description: z.string().optional(),
     enabled: z.boolean().default(true)
});

export const updatePlanValidator = z.object({
     body: z.object({
          name: z.string().min(3).optional(),
          price: z.number().min(0).optional(),
          billingCycle: z.enum(['monthly', 'yearly']).optional(),
          description: z.string().min(10).optional(),
          features: z.array(featureSchema).optional(),
          isActive: z.boolean().optional()
     })
});