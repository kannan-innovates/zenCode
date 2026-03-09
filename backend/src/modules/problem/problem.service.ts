import { ProblemRepository } from "./problem.repository";
import { CreateProblemInput } from "./types/create-problem.input";
import { UpdateProblemInput } from "./types/update-problem.input";
import { AppError } from "../../shared/utils/AppError";
import { STATUS_CODES } from "../../shared/constants/status";
import { ListProblemsQuery } from "./types/list-problems.query";

export class ProblemService {
     private problemRepository: ProblemRepository

     constructor() {
          this.problemRepository = new ProblemRepository();
     }

     //CREATE PROBLEM ADMIN
     async createProblem(adminId: string, data: CreateProblemInput) {

          const existingProblem = await this.problemRepository.findByTitle(data.title);
          if (existingProblem) {
               throw new AppError(
                    'Problem with this title already exists',
                    STATUS_CODES.CONFLICT
               )
          }
          const problem = await this.problemRepository.createProblem({
               ...data,
               createdBy: adminId
          })
          return problem;
     }

     //LIST PROBLEM ADMIN
     async listProblems(query: ListProblemsQuery) {

          const page = Number(query.page) || 1
          const limit = Math.min(Number(query.limit) || 10, 50)

          const skip = (page - 1) * limit

          const filters: any = {}

          if (query.search) {
               filters.$or = [
                    { title: { $regex: query.search, $options: "i" } },
                    { tags: { $regex: query.search, $options: "i" } }
               ];
          }

          if (query.difficulty) {
               filters.difficulty = query.difficulty
          }

          if (query.tag) {
               filters.tags = query.tag
          }

          if (query.isPremium !== undefined) {
               filters.isPremium = query.isPremium
          }

          if (query.isActive !== undefined) {
               filters.isActive = query.isActive
          }

          const sort: any = {
               [query.sortBy || "createdAt"]: query.sortOrder === "asc" ? 1 : -1
          }

          const { problems, total } =
               await this.problemRepository.listProblems(filters, skip, limit, sort)

          return {
               data: problems,
               meta: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit)
               }
          }
     }

     //GET PROBLEM DETEAILS ADMIN

     async getProblemById(problemId: string) {

          const problem = await this.problemRepository.findById(problemId)

          if (!problem) {
               throw new AppError(
                    "Problem not found",
                    STATUS_CODES.NOT_FOUND
               )
          }

          return problem
     }

     //UPDATE PROBLEM ADMIN
     async updateProblem(problemId: string, data: UpdateProblemInput) {

          const problem = await this.problemRepository.updateById(problemId, data)

          if (!problem) {
               throw new AppError(
                    "Problem not found",
                    STATUS_CODES.NOT_FOUND
               )
          }

          return problem
     }

     //GET DISTINCT TAGS (for admin form - existing tags from problems)
     async getDistinctTags(): Promise<string[]> {
          return this.problemRepository.getDistinctTags()
     }

     //DELETE PROBLEM (SOFT DELETE)
     async deleteProblem(problemId: string) {

          const problem = await this.problemRepository.softDeleteById(problemId)

          if (!problem) {
               throw new AppError(
                    "Problem not found",
                    STATUS_CODES.NOT_FOUND
               )
          }

          return problem
     }

     //CANDIDATE
     async listCandidateProblems(query: ListProblemsQuery) {

          const page = Number(query.page) || 1
          const limit = Math.min(Number(query.limit) || 20, 50)

          const skip = (page - 1) * limit

          const filters: any = {
               isActive: true
          }

          if (query.search) {
               filters.title = { $regex: query.search, $options: "i" }
          }

          if (query.difficulty) {
               filters.difficulty = query.difficulty
          }

          if (query.tag) {
               filters.tags = query.tag
          }

          if (query.isPremium !== undefined) {
               filters.isPremium = query.isPremium
          }

          const sort: any = {
               [query.sortBy || "createdAt"]: query.sortOrder === "asc" ? 1 : -1
          }

          const { problems, total } =
               await this.problemRepository.listProblems(filters, skip, limit, sort)

          return {
               data: problems,
               meta: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit)
               }
          }
     }

     async getCandidateProblem(problemId: string) {

          const problem = await this.problemRepository.findById(problemId)

          if (!problem || !problem.isActive) {
               throw new AppError(
                    "Problem not found",
                    STATUS_CODES.NOT_FOUND
               )
          }

          const { testCases, ...result } = problem.toObject()
          return result
     }
}