import { Plan } from "./plan.model";
import { CreatePlanInput } from "./types/create-plan.input";
import { UpdatePlanInput } from "./types/update-plan.input";

export class PlanRepository {
     async create(data: CreatePlanInput) {
          return Plan.create(data);
     }

     async findByName(name: string) {
          return Plan.findOne({ name });
     }

     async findById(id: string) {
          return Plan.findById(id);
     }

     async updateById(id: string, data: UpdatePlanInput) {
          return Plan.findByIdAndUpdate(id, data, { new: true });
     }

     async listActive() {
          return Plan.find({ isActive: true }).sort({ price: 1 });
     }

     async listAll() {
          return Plan.find().sort({ createdAt: -1 });
     }
}