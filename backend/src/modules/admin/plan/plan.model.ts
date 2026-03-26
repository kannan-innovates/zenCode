import { Schema, model } from "mongoose";

const PlanSchema = new Schema(
     {
          name: {
               type: String,
               required: true,
               unique: true,
               trim: true
          },

          price: {
               type: Number,
               required: true,
               min: 0
          },

          billingCycle: {
               type: String,
               enum: ['monthly', 'yearly'],
               default: 'monthly'
          },

          durationInDays: {
               type: Number,
               required: true,
               min: 1
          },

          description: {
               type: String,
               required: true
          },

          features: {
               type: [
                    {
                         name: { type: String, required: true },
                         description: { type: String },
                         enabled: { type: Boolean, default: true }
                    }
               ],
               default: []
          },

          isActive: {
               type: Boolean,
               default: true
          }
     },
     { timestamps: true }
);

PlanSchema.index({ isActive: 1 });
PlanSchema.index({ name: 1 });

export const Plan = model("Plan", PlanSchema);