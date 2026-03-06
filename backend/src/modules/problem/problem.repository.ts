import ProblemModel from "./problem.model"
import { CreateProblemInput } from "./types/create-problem.input"
import { UpdateProblemInput } from "./types/update-problem.input"

export class ProblemRepository {

     async createProblem(data: CreateProblemInput & { createdBy: string }) {
          return ProblemModel.create(data)
     }

     async findByTitle(title: string) {
          return ProblemModel.findOne({ title })
     }

     async findById(problemId: string) {
          return ProblemModel.findById(problemId)
     }
     async listProblems(filters: any, skip: number, limit: number, sort: any) {
          const [problems, total] = await Promise.all([
               ProblemModel.find(filters)
                    .sort(sort)
                    .skip(skip)
                    .limit(limit)
                    .select("-testCases"),
               ProblemModel.countDocuments(filters)
          ]);

          return { problems, total };
     }
     async updateById(problemId: string, data: UpdateProblemInput) {
          return ProblemModel.findByIdAndUpdate(
               problemId,
               { $set: data },
               { new: true, runValidators: true }
          )
     }

     async softDeleteById(problemId: string) {
          return ProblemModel.findByIdAndUpdate(
               problemId,
               { $set: { isActive: false } },
               { new: true }
          )
     }

     async getDistinctTags(): Promise<string[]> {
          const tags = await ProblemModel.distinct("tags")
          return tags.filter(Boolean).sort()
     }

}