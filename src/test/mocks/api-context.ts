import env from "@/envs-runtime";

export const mockApiContext = (userId: string) => ({
  locals: { env, user: { id: userId } },
});
