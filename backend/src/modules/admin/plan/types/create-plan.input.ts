export interface PlanFeature {
     name: string;
     description?: string;
     enabled: boolean;
}

export interface CreatePlanInput {
     name: string;
     price: number;
     billingCycle: 'monthly' | 'yearly';
     description: string;
     features: PlanFeature[];
}