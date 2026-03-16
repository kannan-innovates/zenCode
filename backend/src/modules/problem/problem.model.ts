import { Schema, model, Types } from "mongoose";

const ExampleSchema = new Schema(
     {
          input: { type: String, required: true },
          output: { type: String, required: true },
          explanation: { type: String }
     },
     { _id: false }
);

const TestCaseSchema = new Schema(
     {
          input: { type: String, required: true },
          output: { type: String, required: true },
          isHidden: { type: Boolean, default: true }
     },
     { _id: false }
);

const StarterCodeSchema = new Schema(
     {
          javascript: { type: String },
          python: { type: String },
          java: { type: String },
          cpp: { type: String },
          c: { type: String },
          csharp: { type: String },
          go: { type: String },
          rust: { type: String },
          typescript: { type: String }
     },
     { _id: false }
);

const FunctionSignatureSchema = new Schema(
     {
          functionName: { type: String, required: true },

          parameters: [
               {
                    name: { type: String },
                    type: { type: String }
               }
          ],

          returnType: { type: String, required: true }
     },
     { _id: false }
);

const ProblemSchema = new Schema(
     {
          title: {
               type: String,
               required: true
          },

          description: {
               type: String,
               required: true
          },

          difficulty: {
               type: String,
               enum: ["easy", "medium", "hard"],
               required: true
          },

          tags: {
               type: [String],
               default: []
          },

          companyTags: {
               type: [String],
               default: []
          },

          constraints: {
               type: String
          },

          examples: {
               type: [ExampleSchema],
               default: []
          },

          starterCode: {
               type: StarterCodeSchema
          },

          functionSignature: {
               type: FunctionSignatureSchema,
               required: true
          },

          testCases: {
               type: [TestCaseSchema],
               required: true
          },

          supportedLanguages: {
               type: [String],
               default: []
          },

          isPremium: {
               type: Boolean,
               default: false
          },

          isActive: {
               type: Boolean,
               default: true
          },

          createdBy: {
               type: Types.ObjectId,
               ref: "User",
               required: true
          }
     },
     {
          timestamps: true
     }
);

ProblemSchema.index({ title: "text" });
ProblemSchema.index({ difficulty: 1 });
ProblemSchema.index({ tags: 1 });
ProblemSchema.index({ companyTags: 1 });
ProblemSchema.index({ isPremium: 1 });
ProblemSchema.index({ isActive: 1 });

export const Problem = model("Problem", ProblemSchema);
export default Problem;