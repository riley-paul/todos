export default function createApiContext(userId: string) {
  return { locals: { user: { id: userId } } } as any;
}
