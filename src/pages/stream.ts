import InvalidationController from "@/lib/server/invalidation-controller";
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ request, locals }) => {
  if (!locals.user) {
    return new Response("Unauthorized", { status: 401 });
  }
  const userId = locals.user.id;

  const body = new ReadableStream({
    start: (controller) => {
      // Text encoder to convert strings to Uint8Array
      const encoder = new TextEncoder();
      let isClosed = false;
      let intervalId: NodeJS.Timeout | null = null;

      // Function to safely enqueue data
      const safeEnqueue = (message: string) => {
        if (isClosed) return;
        try {
          controller.enqueue(encoder.encode(message));
        } catch (err) {
          console.error("Error during enqueue:", err);
          if (intervalId) clearInterval(intervalId);
        }
      };

      intervalId = setInterval(() => {
        safeEnqueue('data: "ping"\n\n');
      }, 3_000);

      // Send event to client
      const invalidateUsers = (userIds: string[]) => {
        if (isClosed) return;
        if (!userIds.includes(userId)) return;
        safeEnqueue('data: "invalidate"\n\n');
      };

      const invalidationController = InvalidationController.getInstance();
      invalidationController.subscribe(invalidateUsers);

      // Centralized cleanup logic
      const cleanup = () => {
        if (isClosed) return; // Prevent double cleanup
        isClosed = true; // Mark stream as closed

        console.log("[Stream Cleanup] Closing stream and clearing resources.");
        if (intervalId !== null) {
          clearInterval(intervalId);
          intervalId = null;
        }

        invalidationController.unsubscribe(invalidateUsers);
        try {
          controller.close();
        } catch (err) {
          console.warn("[Stream Cleanup] Error closing stream:", err);
        }
      };

      // Handle the connection closing
      request.signal.addEventListener("abort", cleanup);

      // Additional cleanup for HMR (only runs in development)
      if (import.meta.env.DEV) {
        import.meta.hot?.on("dispose", cleanup);
      }
    },
  });

  return new Response(body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
};
