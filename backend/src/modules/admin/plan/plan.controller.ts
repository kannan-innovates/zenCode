import { Request, Response, NextFunction } from "express";
import { PlanService } from "./plan.service";
import { sendSuccess } from "../../../shared/utils/response.util";
import { STATUS_CODES } from "../../../shared/constants/status";

export class PlanController {
     private planService = new PlanService();

     createPlan = async (req: Request, res: Response, next: NextFunction) => {
          try {
               const plan = await this.planService.createPlan(req.body);
               return sendSuccess(res, {
                    statusCode: STATUS_CODES.CREATED,
                    message: 'Plan created successfully',
                    data: plan
               });
          } catch (error) {
               next(error);
          }
     };

     updatePlan = async (req: Request, res: Response, next: NextFunction) => {
          try {
               const plan = await this.planService.updatePlan(
                    req.params.id as string,
                    req.body
               );

               return sendSuccess(res, {
                    statusCode: STATUS_CODES.OK,
                    message: "Plan updated successfully",
                    data: plan
               });
          } catch (error) {
               next(error);
          }
     };

     getAdminPlans = async (req: Request, res: Response, next: NextFunction) => {
          try {
               const plans = await this.planService.getPlansForAdmin();

               return sendSuccess(res, {
                    statusCode: STATUS_CODES.OK,
                    message: "Plans fetched successfully",
                    data: plans
               });
          } catch (error) {
               next(error);
          }
     };

     getActivePlans = async (req: Request, res: Response, next: NextFunction) => {
          try {
               const plans = await this.planService.getActivePlans();

               return sendSuccess(res, {
                    statusCode: STATUS_CODES.OK,
                    message: "Active plans fetched successfully",
                    data: plans
               });
          } catch (error) {
               next(error);
          }
     };

     togglePlanStatus = async (req: Request, res: Response, next: NextFunction) => {
          try {
               const plan = await this.planService.togglePlanStatus(req.params.id as string);

               return sendSuccess(res, {
                    statusCode: STATUS_CODES.OK,
                    message: `Plan ${plan!.isActive ? 'activated' : 'deactivated'} successfully`,
                    data: plan
               });
          } catch (error) {
               next(error);
          }
     };
}