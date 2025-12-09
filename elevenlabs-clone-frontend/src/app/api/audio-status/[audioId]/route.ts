import type {NextRequest} from "next/server";
import {auth} from "~/server/better-auth";
import {headers} from "next/headers";
import {db} from "~/server/db";
import {getPresignedUrl} from "~/lib/s3";
import type {AudioStatusData} from "~/hooks/useAudioStatus";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
    request: NextRequest,
    { params }: { params: { audioId: string } }
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { audioId } = params;

  // Create SSE stream
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (data: AudioStatusData) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      try {
        // Poll database every 500ms
        const pollInterval = setInterval(() => {
          void (async () => {
            try {
              const audioClip = await db.generatedAudioClip.findFirst({
                where: {
                  id: audioId,
                  userId: session.user.id,
                },
                select: {
                  id: true,
                  failed: true,
                  s3Key: true,
                  service: true,
                },
              });

              if (!audioClip) {
                clearInterval(pollInterval);
                sendEvent({ status: "error", message: "Audio not found" });
                controller.close();
                return;
              }

              // Failed status
              if (audioClip.failed) {
                clearInterval(pollInterval);
                sendEvent({ status: "failed" });
                controller.close();
                return;
              }

              // Success status
              if (audioClip.s3Key) {
                clearInterval(pollInterval);
                const audioUrl = await getPresignedUrl({ key: audioClip.s3Key });
                sendEvent({
                  status: "success",
                  audioUrl,
                  service: audioClip.service
                });
                controller.close();
                return;
              }

              // Still processing
              sendEvent({ status: "processing" });
            } catch (e) {
              console.error("SSE poll error: ", e);
              clearInterval(pollInterval);
              sendEvent({ status: "error", message: "Internal error" });
              controller.close();
            }
          })();
        }, 500);

        // Cleanup after 5 minutes (timeout)
        setTimeout(() => {
          clearInterval(pollInterval);
          sendEvent({ status: "timeout" });
          controller.close();
        }, 300000);
      } catch (e) {
        console.error("SSE setup error: ", e);
        sendEvent({ status: "error", message: "Setup failed" });
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}