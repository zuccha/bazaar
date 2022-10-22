export type ResultOk<T> = {
  data: T;
};

export type ResultVoid = Result<undefined>;

export type ResultError = {
  scope: string;
  message: string;
  code: number;
  trace: ResultError | undefined;
};

export type Result<T> = ResultOk<T> | ResultError;

export const R = {
  /**
   * An empty response.
   */
  Void: { data: undefined },

  /**
   * Create a success response.
   * @param data Data of the response.
   * @returns The success response.
   */
  Ok: <T>(data: T): ResultOk<T> => ({ data }),

  /**
   * Create an error response.
   * @param scope Scope (function) where the error occurred.
   * @param message Message of the error.
   * @param code Error code.
   * @returns The error, with no trace.
   */
  Error: (scope: string, message: string, code: number): ResultError => ({
    scope,
    code,
    message,
    trace: undefined,
  }),

  /**
   * Stack a new error into an existing one.
   * @param error The old error.
   * @param scope Scope (function) where the new error occurred.
   * @param message The new error message.
   * @param code The new error code.
   * @returns The new error, with the old error in the trace.
   */
  Stack: (
    error: ResultError,
    scope: string,
    message: string,
    code: number,
  ): ResultError => ({
    message,
    scope,
    code,
    trace: error,
  }),

  /**
   * Get a list of all messages in an error trace.
   * @param error The error from which we want to retrieve the messages from.
   * @returns The list of messages, from most recent to oldest.
   */
  messages: (error: ResultError): string[] => {
    return error.trace
      ? [error.message, ...R.messages(error.trace)]
      : [error.message];
  },

  /**
   * Check if a result is ok or not.
   * @param result The result to be evaluated.
   * @returns True if the result is ok, false otherwise.
   */
  isOk: <T>(result: Result<T>): result is ResultOk<T> => {
    return "data" in result;
  },

  /**
   * Check if a result is an error or not.
   * @param result The result to be evaluated.
   * @returns True if the result is an error, false otherwise.
   */
  isError: <T>(result: Result<T>): result is ResultError => {
    return "message" in result;
  },
};
