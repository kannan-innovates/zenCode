import { SupportedLanguage } from '../language.constants';

export interface ExecuteCodeInput {
     language: SupportedLanguage;
     sourceCode: string;
     stdin?: string;
     problemId?: string;
     testCases?: any[];
     functionSignature?: any;
}

export interface Judge0Submission {
     source_code: string;
     language_id: number;
     stdin?: string;
     expected_output?: string;
     cpu_time_limit?: number;
     memory_limit?: number;
}

export interface Judge0Response {
     stdout: string | null;
     stderr: string | null;
     status: {
          id: number;
          description: string;
     };
     time: string | null;
     memory: number | null;
     compile_output: string | null;
     testResults?: {
          input: string;
          expectedOutput: string;
          actualOutput: string;
          passed: boolean;
          error?: string;
     }[];
}
