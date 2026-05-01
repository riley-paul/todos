// Minimal local stub for the ActionAPIContext type
export type ActionAPIContext = {
  locals: Record<string, unknown>;
  [key: string]: unknown;
};

export class ActionError extends Error {
  code: string;
  constructor({ code, message }: { code: string; message?: string }) {
    super(message);
    this.name = "ActionError";
    this.code = code;
  }
}

export const defineAction = <TInput, TOutput>({
  input,
  handler,
}: {
  input?: unknown;
  handler: (input: TInput, context: ActionAPIContext) => TOutput;
}) => handler;
