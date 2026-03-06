import {
     ExampleInput,
     FunctionSignatureInput,
     StarterCodeInput,
     TestCaseInput
} from "./create-problem.input"

export type UpdateProblemInput = {
     title?: string
     description?: string
     difficulty?: "easy" | "medium" | "hard"

     tags?: string[]
     companyTags?: string[]

     constraints?: string

     examples?: ExampleInput[]

     starterCode?: StarterCodeInput

     functionSignature?: FunctionSignatureInput

     testCases?: TestCaseInput[]

     supportedLanguages?: string[]

     isPremium?: boolean
     isActive?: boolean
}
