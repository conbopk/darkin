import type {ServiceType} from "~/types/services";
import {auth} from "~/server/better-auth";
import {headers} from "next/headers";
import {db} from "~/server/db";
import {getPresignedUrl} from "~/lib/s3";

export type HistoryItem = {
  id: string;
  title: string;
  voice: string | null;
  audioUrl: string | null;
  time: string;
  date: string;
  service: ServiceType;
};

export async function getHistoryItems(service: ServiceType): Promise<HistoryItem[]> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return [];
  }

  try {
    const audioClips = await db.generatedAudioClip.findMany({
      where: {
        userId: session.user.id,
        s3Key: { not: null },
        service: service,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
      select: {
        id: true,
        text: true,
        voice: true,
        s3Key: true,
        createdAt: true,
        service: true,
      },
    });

    // Transform DB results to history items
    return await Promise.all(
        audioClips.map(async (clip) => {
          let title = "Generated clip";
          if (clip.service === "seedvc") {
            title = "Voice conversion to " + clip.voice;
          } else if (clip.text !== null) {
            // Generate title from text
            title = clip.text.length > 50 ? `${clip.text.substring(0, 50)}...` : clip.text;
          }

          // Get URL from S3 key
          const audioUrl = clip.s3Key ? await getPresignedUrl({key: clip.s3Key}) : null;

          // Format date and time
          const createAt = new Date(clip.createdAt);
          const date = createAt.toLocaleDateString();
          const time = createAt.toLocaleTimeString([], {
            "hour": "2-digit",
            "minute": "2-digit",
          });

          return {
            id: clip.id,
            title: title,
            voice: clip.voice,
            audioUrl: audioUrl,
            date: date,
            time: time,
            service: service,
          };
        }),
    );

  } catch (e) {
    console.error("Error fetching history items: ", e);
    return [];
  }
}