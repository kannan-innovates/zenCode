import { Request, NextFunction, Response } from "express";
import { ProblemService } from "./problem.service";
import { AuthenticatedRequest } from "../../shared/types/authenticated-request";
import { sendSuccess } from "../../shared/utils/response.util";
import { STATUS_CODES } from "../../shared/constants/status";

export class ProblemController {
     private problemService: ProblemService;

     constructor() {
          this.problemService = new ProblemService();
     }

     createProblem = async (
          req: Request,
          res: Response,
          next: NextFunction
     ): Promise<void> => {
          try {
               const authReq = req as AuthenticatedRequest;
               const adminId = authReq.user.id;
               const problem = await this.problemService.createProblem(
                    adminId,
                    req.body
               );
               return sendSuccess(res, {
                    statusCode: STATUS_CODES.CREATED,
                    message: "Problem created successfully",
                    data: problem,
               });
          } catch (error) {
               next(error);
          }
     }


     listProblems = async (
          req: Request,
          res: Response,
          next: NextFunction
     ): Promise<void> => {
          try {

               const result = await this.problemService.listProblems(req.query)

               sendSuccess(res, {
                    statusCode: STATUS_CODES.OK,
                    message: "Problems fetched successfully",
                    data: result
               })

          } catch (error) {
               next(error)
          }
     }

     getProblemTags = async (
          req: Request,
          res: Response,
          next: NextFunction
     ): Promise<void> => {
          try {
               const tags = await this.problemService.getDistinctTags()
               return sendSuccess(res, {
                    statusCode: STATUS_CODES.OK,
                    message: "Tags fetched successfully",
                    data: tags,
               })
          } catch (error) {
               next(error)
          }
     }

     getProblem = async (
          req: Request,
          res: Response,
          next: NextFunction
     ): Promise<void> => {
          try {

               const problem = await this.problemService.getProblemById(req.params.id as string)

               sendSuccess(res, {
                    statusCode: STATUS_CODES.OK,
                    message: "Problem fetched",
                    data: problem
               })

          } catch (error) {
               next(error)
          }
     }

     updateProblem = async (
          req: Request,
          res: Response,
          next: NextFunction
     ): Promise<void> => {
          try {

               const problem = await this.problemService.updateProblem(
                    req.params.id as string,
                    req.body
               )

               sendSuccess(res, {
                    statusCode: STATUS_CODES.OK,
                    message: "Problem updated successfully",
                    data: problem
               })

          } catch (error) {
               next(error)
          }
     }

     deleteProblem = async (
          req: Request,
          res: Response,
          next: NextFunction
     ): Promise<void> => {
          try {

               await this.problemService.deleteProblem(req.params.id as string)

               sendSuccess(res, {
                    statusCode: STATUS_CODES.OK,
                    message: "Problem deleted successfully"
               })

          } catch (error) {
               next(error)
          }
     }

     listCandidateProblems = async (
          req: Request,
          res: Response,
          next: NextFunction
     ): Promise<void> => {
          try {

               const result =
                    await this.problemService.listCandidateProblems(req.query)

               sendSuccess(res, {
                    statusCode: STATUS_CODES.OK,
                    message: "Problems fetched successfully",
                    data: result
               })

          } catch (error) {
               next(error)
          }
     }


     getCandidateProblem = async (
          req: Request,
          res: Response,
          next: NextFunction
     ): Promise<void> => {
          try {

               const problem =
                    await this.problemService.getCandidateProblem(req.params.id as string)

               sendSuccess(res, {
                    statusCode: STATUS_CODES.OK,
                    message: "Problem fetched successfully",
                    data: problem
               })

          } catch (error) {
               next(error)
          }
     }
}