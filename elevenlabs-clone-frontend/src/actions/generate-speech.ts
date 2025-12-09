"use server";

import {auth} from "~/server/better-auth";
import {headers} from "next/headers";
import {redirect} from "next/navigation";
import {db} from "~/server/db";
import {inngest} from "~/inngest/client";
import type {ServiceType} from "~/types/services";
import {revalidatePath} from "next/cache";
import {getPresignedUrl, getUploadUrl} from "~/lib/s3";

export async function generateTextToSpeech(text: string, voice: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/auth/sign-in");

  const audioClipJob = await db.generatedAudioClip.create({
    data: {
      text: text,
      voice: voice,
      user: {
        connect: {
          id: session.user.id
        },
      },
      service: "styletts2",
    },
  });

  await inngest.send({
    name: "generate-audio",
    data: {
      audioClipId: audioClipJob.id,
      userId: session.user.id,
    },
  });

  return {
    audioId: audioClipJob.id,
    shouldShowThrottleAlert: await shouldShowThrottleAlert(session.user.id),
  };
}


export async function generateSpeechToSpeech(
    originalVoiceS3Key: string,
    voice: string,
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/auth/sign-in");

  const audioClipJob = await db.generatedAudioClip.create({
    data: {
      originalVoiceS3Key: originalVoiceS3Key,
      voice: voice,
      user: {
        connect: {
          id: session.user.id
        },
      },
      service: "seedvc",
    },
  });

  await inngest.send({
    name: "generate-audio",
    data: {
      audioClipId: audioClipJob.id,
      userId: session.user.id,
    },
  });

  return {
    audioId: audioClipJob.id,
    shouldShowThrottleAlert: await shouldShowThrottleAlert(session.user.id),
  };
}


export async function generateSoundEffect(prompt: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/auth/sign-in");

  const audioClipJob = await db.generatedAudioClip.create({
    data: {
      text: prompt,
      user: {
        connect: {
          id: session.user.id
        },
      },
      service: "make-an-audio",
    },
  });

  await inngest.send({
    name: "generate-audio",
    data: {
      audioClipId: audioClipJob.id,
      userId: session.user.id,
    },
  });

  return {
    audioId: audioClipJob.id,
    shouldShowThrottleAlert: await shouldShowThrottleAlert(session.user.id),
  };
}

const shouldShowThrottleAlert = async (userId: string) => {
  const oneMinuteAgo = new Date();
  oneMinuteAgo.setMinutes(oneMinuteAgo.getMinutes() - 1);

  const count = await db.generatedAudioClip.count({
    where: {
      userId: userId,
      createdAt: {
        gte: oneMinuteAgo,
      },
    },
  });

  return count > 5;
};


export async function generationStatus(
    audioId: string,
): Promise<{ success: boolean; audioUrl: string | null }> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/auth/sign-in");

  const audioClip = await db.generatedAudioClip.findFirstOrThrow({
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

  if (audioClip.failed) {
    await revalidateBasedOnService(audioClip.service as ServiceType);
    return { success: false, audioUrl: null };
  }

  if (audioClip.s3Key) {
    await revalidateBasedOnService(audioClip.service as ServiceType);
    return {
      success: true,
      audioUrl: await getPresignedUrl({ key: audioClip.s3Key }),
    };
  }

  return {
    success: true,
    audioUrl: null,
  };
}

const revalidateBasedOnService = async (service: ServiceType) => {
  switch (service) {
    case "styletts2":
      revalidatePath("/speech-synthesis/text-to-speech");
      break;
    case "seedvc":
      revalidatePath("/speech-synthesis/speech-to-speech");
      break;
    case "make-an-audio":
      revalidatePath("/sound-effects/history");
      break;
  }
};

export async function generateUploadUrl(fileType: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user.id) {
    throw new Error("User not authenticated");
  }

  return await getUploadUrl(fileType);
}