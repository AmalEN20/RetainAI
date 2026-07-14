export interface D1Result<T = Record<string, unknown>> {
  results?: T[];
  success: boolean;
}

export interface D1Statement {
  bind(...values: unknown[]): D1Statement;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  all<T = Record<string, unknown>>(): Promise<D1Result<T>>;
  run(): Promise<D1Result>;
}

export interface D1Database {
  prepare(query: string): D1Statement;
  batch<T = Record<string, unknown>>(statements: D1Statement[]): Promise<D1Result<T>[]>;
}

type PlatformEnv = {
  DB?: D1Database;
};

const platform = globalThis as typeof globalThis & { __retainAiPlatformEnv?: PlatformEnv };

export function setPlatformEnv(env: PlatformEnv) {
  platform.__retainAiPlatformEnv = env;
}

export function getDemoDatabase() {
  return platform.__retainAiPlatformEnv?.DB ?? null;
}
