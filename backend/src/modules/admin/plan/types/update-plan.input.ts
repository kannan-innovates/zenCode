import { PlanFeature } from './create-plan.input';

export interface UpdatePlanInput {
     name?: string;
     price?: number;
     billingCycle?: 'monthly' | 'yearly';
     description?: string;
     features?: PlanFeature[];
     isActive?: boolean;
}