export const LANGUAGE_IDS = {
     javascript: 63,  // Node.js
     python: 71,      // Python 3
} as const;

export type SupportedLanguage = keyof typeof LANGUAGE_IDS;

export const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
     javascript: 'JavaScript (Node.js)',
     python: 'Python 3',
};

export const DEFAULT_TIMEOUT = 10;
export const MAX_MEMORY = 256000; 