export type ExampleInput = {
     input: string
     output: string
     explanation?: string
}

export type TestCaseInput = {
     input: string
     output: string
     isHidden?: boolean
}

export type ParameterInput = {
     name: string
     type: string
}

export type FunctionSignatureInput = {
     functionName: string
     parameters: ParameterInput[]
     returnType: string
}

export type StarterCodeInput = {
     javascript?: string
     python?: string
     java?: string
     cpp?: string
     c?: string
     csharp?: string
     go?: string
     rust?: string
     typescript?: string
}

export type CreateProblemInput = {
     title: string
     description: string
     difficulty: "easy" | "medium" | "hard"

     tags: string[]
     companyTags?: string[]

     constraints?: string

     examples?: ExampleInput[]

     starterCode?: StarterCodeInput

     functionSignature: FunctionSignatureInput

     testCases: TestCaseInput[]

     supportedLanguages?: string[]

     isPremium?: boolean
     createdBy?: string
}