export type Logger = {
  log: (message: string) => void;
  start: (message: string) => void;
  done: (message?: string) => void;
  success: () => void;
  failure: () => void;
  stop: () => void;
};
