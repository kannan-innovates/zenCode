export const LANGUAGE_IDS = {
     javascript: 63,  // Node.js
     python: 71,      // Python 3
     java: 62,        // Java (OpenJDK)
     cpp: 54,         // C++ (GCC)
     c: 50,           // C (GCC)
     csharp: 51,      // C#
     go: 60,          // Go
     rust: 73,        // Rust
     typescript: 74,  // TypeScript
} as const;

export type SupportedLanguage = keyof typeof LANGUAGE_IDS;

export const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
     javascript: 'JavaScript (Node.js)',
     python: 'Python 3',
     java: 'Java',
     cpp: 'C++',
     c: 'C',
     csharp: 'C#',
     go: 'Go',
     rust: 'Rust',
     typescript: 'TypeScript',
};

export const DEFAULT_TIMEOUT = 10;
export const MAX_MEMORY = 256000; 