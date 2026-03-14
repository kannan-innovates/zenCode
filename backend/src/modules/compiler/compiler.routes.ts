import { Router } from 'express';
import { CompilerController } from './compiler.controller';
import { authMiddleware } from '../../shared/middlewares/auth.middleware';
import { validateRequest } from '../../shared/middlewares/validate.middleware';
import { executeCodeValidator } from './validators/execute-code.validator';
import { compilerRateLimit, problemRateLimit } from './middlewares/rate-limit.middleware';

const router = Router();
const controller = new CompilerController();

router.post(
     '/execute',
     authMiddleware,
     compilerRateLimit,
     problemRateLimit,
     validateRequest(executeCodeValidator),
     controller.executeCode
);

router.get(
     '/result/:token',
     authMiddleware,
     controller.getResult
);

export default router;