import env from "@/envs-runtime";
import type { z } from "astro/zod";

export type ActionAPIContext = {
  locals: Record<string, unknown>;
  [key: string]: unknown;
};

// Mutable context updated between tests via mockActions()
let currentContext: ActionAPIContext = {
  locals: { env, user: null },
};

export const mockActions = (userId: string) => {
  currentContext = {
    locals: { env, user: { id: userId } },
  };
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
  input?: z.ZodType<TInput>;
  handler: (input: TInput, context: ActionAPIContext) => TOutput;
}) => ({
  orThrow: (i?: TInput): TOutput => {
    const validated = input ? input.parse(i) : (i as TInput);
    return handler(validated, currentContext);
  },
});
