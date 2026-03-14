import axios from 'axios';
import { LANGUAGE_IDS, DEFAULT_TIMEOUT, MAX_MEMORY } from './language.constants';
import { AppError } from '../../shared/utils/AppError';
import { STATUS_CODES } from '../../shared/constants/status';

import { ExecuteCodeInput, Judge0Submission, Judge0Response } from './types/compiler.types';

export class CompilerService {
     private readonly judge0ApiUrl: string;
     private readonly judge0AuthToken: string;

     constructor() {
          // Point to local dockerized Judge0
          this.judge0ApiUrl = process.env.JUDGE0_API_URL || 'http://localhost:2358';
          this.judge0AuthToken = process.env.JUDGE0_AUTH_TOKEN || '';
     }

     async createExecution(input: ExecuteCodeInput): Promise<{ token: string }> {
          const { language, sourceCode, stdin } = input;

          const languageId = LANGUAGE_IDS[language];

          if (!languageId) {
               throw new AppError('Unsupported language', STATUS_CODES.BAD_REQUEST);
          }

          const response = await axios.post(
               `${this.judge0ApiUrl}/submissions?base64_encoded=true&wait=false`,
               {
                    source_code: Buffer.from(sourceCode).toString('base64'),
                    language_id: languageId,
                    stdin: stdin ? Buffer.from(stdin).toString('base64') : undefined,
                    cpu_time_limit: DEFAULT_TIMEOUT,
                    memory_limit: MAX_MEMORY,
               },
                {
                    headers: {
                         'Content-Type': 'application/json',
                         'X-Auth-Token': this.judge0AuthToken
                    },
               }
          );
          if (!response.data || !response.data.token) {
               throw new AppError('Judge0 execution failed', STATUS_CODES.INTERNAL_SERVER_ERROR);
          }

          return response.data;
     }

     async getExecutionResult(token: string) {
          const response = await axios.get(
               `${this.judge0ApiUrl}/submissions/${token}?base64_encoded=true`,
               {
                    headers: {
                         'X-Auth-Token': this.judge0AuthToken
                    }
               }
          );

          const result = response.data;

          // If Judge0 status is In Queue (1) or Processing (2), return processing status
          if (result.status && result.status.id <= 2) {
               return {
                    status: { id: result.status.id, description: 'processing' }
               };
          }

          return {
               stdout: result.stdout ? Buffer.from(result.stdout, 'base64').toString() : null,
               stderr: result.stderr ? Buffer.from(result.stderr, 'base64').toString() : null,
               compile_output: result.compile_output
                    ? Buffer.from(result.compile_output, 'base64').toString()
                    : null,
               status: result.status,
               time: result.time,
               memory: result.memory,
          };
     }
}