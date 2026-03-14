import rateLimit from 'express-rate-limit';

export const compilerRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: 'Too many code executions. Please slow down.',
});

export const problemRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  keyGenerator: (req) => {
    const userId = (req as any).user?.id || 'anonymous';
    const problemId = req.body?.problemId || 'general';
    return `${userId}-${problemId}`;
  },
  message: 'You can only run code 5 times per minute for this specific problem.',
});
