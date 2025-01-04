import InvalidationController from "@/lib/invalidation-controller";
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

      // Send a retry directive to the client
      controller.enqueue(encoder.encode(`retry: 5000\n\n`)); // Retry after 5 seconds if disconnected

      const intervalId = setInterval(() => {
        const message = `data: "ping"\n\n`;
        controller.enqueue(encoder.encode(message));
      }, 3_000);

      // Send event to client
      const invalidateUsers = (userIds: string[]) => {
        if (!userIds.includes(userId)) return;
        const message = `data: "invalidate"\n\n`;
        controller.enqueue(encoder.encode(message));
      };

      InvalidationController.getInstance().subscribe(invalidateUsers);

      // Handle the connection closing
      request.signal.addEventListener("abort", () => {
        InvalidationController.getInstance().unsubscribe(invalidateUsers);
        controller.close();
        clearInterval(intervalId);
      });
    },
  });

  // if (import.meta.env.DEV) {
  //   return new Response("");
  // }

  return new Response(body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
};
