export interface FieldError {
  field: string;
  message: string;
}

// An error with a message that's safe to send back to the client.
// Anything sensitive goes in `cause`, which only ever ends up in the server logs.
export class HttpError extends Error {
  status: number;
  code: string;
  details?: FieldError[];

  constructor(status: number, code: string, message: string, opts: { details?: FieldError[]; cause?: unknown } = {}) {
    super(message, { cause: opts.cause });
    this.status = status;
    this.code = code;
    this.details = opts.details;
  }
}
