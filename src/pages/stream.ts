import RoomController, { type RoomData } from "@/lib/room-controller";
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

      // Send event to client
      const sendEvent = (data: RoomData) => {
        if (!data.userIds.includes(userId)) return;
        const message = `data: ${JSON.stringify(data.key)}\n\n`;
        controller.enqueue(encoder.encode(message));
      };

      RoomController.getInstance().subscribe(sendEvent);

      // Handle the connection closing
      request.signal.addEventListener("abort", () => {
        controller.close();
      });
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
