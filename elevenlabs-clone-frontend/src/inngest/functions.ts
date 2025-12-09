import { inngest } from "~/inngest/client";
import {db} from "~/server/db";
import {env} from "~/env";

export const aiGenerationFunction = inngest.createFunction(
    {
      id: "generate-audio-clip",
      retries: 2,
      concurrency: {
        limit: 5,
        key: "event.data.userId",
      },
      onFailure: async ({ event, error }) => {
        await db.generatedAudioClip.update({
          where: {
            id: (event?.data?.event.data as { audioClipId: string }).audioClipId,
          },
          data: {
            failed: true,
          },
        });
      },
    },
    { event: "generate-audio" },
    async ({ event, step }) => {
      const { audioClipId } = event.data as {
        audioClipId: string,
        userId: string
      };

      const audioClip = await step.run("get-clip", async () => {
        return await db.generatedAudioClip.findUniqueOrThrow({
          where: { id: audioClipId },
          select: {
            id: true,
            text: true,
            voice: true,
            userId: true,
            service: true,
            originalVoiceS3Key: true,
          },
        });
      });

      let response: Response | null = null;

      if (audioClip.service === "styletts2") {
        response = await step.fetch(env.TEXT_TO_SPEECH_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Modal-Key": env.MODAL_KEY,
            "Modal-Secret": env.MODAL_SECRET,
          },
          body: JSON.stringify({
            text: audioClip.text,
            target_voice: audioClip.voice,
          }),
        });
      } else if (audioClip.service === "seedvc") {
        response = await step.fetch(env.SPEECH_TO_SPEECH_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Modal-Key": env.MODAL_KEY,
            "Modal-Secret": env.MODAL_SECRET,
          },
          body: JSON.stringify({
            source_audio_key: audioClip.originalVoiceS3Key,
            target_voice: audioClip.voice,
          }),
        });
      } else if (audioClip.service === "make-an-audio") {
        response = await step.fetch(env.SOUND_EFFECT_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Modal-Key": env.MODAL_KEY,
            "Modal-Secret": env.MODAL_SECRET,
          },
          body: JSON.stringify({
            prompt: audioClip.text,
          }),
        });
      }

      if (!response) {
        throw new Error("API error: no response");
      }

      if (!response.ok) {
        await db.generatedAudioClip.update({
          where: { id: audioClip.id },
          data: {
            failed: true,
          }
        });

        throw new Error("API error: " + response.statusText);
      }

      const data = await response.json() as { s3_key: string };

      const history = await step.run("save-to-history", async () => {
        return await db.generatedAudioClip.update({
          where: { id: audioClip.id },
          data: {
            s3Key: data.s3_key,
          },
        });
      });

      const deductCredits = await step.run("deduct-credits", async () => {
        return await db.user.update({
          where: { id: audioClip.userId },
          data: {
            credits: {
              decrement: 50,
            },
          },
        });
      });

      return { success: true };
    },
);