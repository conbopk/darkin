import {PageLayout} from "~/components/page-layout";
import {auth} from "~/server/better-auth";
import {headers} from "next/headers";
import {redirect} from "next/navigation";
import {db} from "~/server/db";
import {SoundEffectsGenerator} from "~/components/sound-effects/sound-effects-generator";

export default async function SoundEffectsGeneratePage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) redirect("/auth/sign-in")

  let credits = 0;

  if (session.session.userId) {
    const user = await db.user.findUnique({
      where: { id: session.session.userId },
      select: {
        credits: true,
      },
    });

    credits = user?.credits ?? 0;
  }

  const service = "make-an-audio"

  const soundEffectsTabs = [
    {
      name: "Generate",
      path: "/sound-effects/generate",
    },
    {
      name: "History",
      path: "/sound-effects/history",
    },
  ];

  return (
      <PageLayout
        title={"Sound Effects"}
        showSidebar={false}
        tabs={soundEffectsTabs}
        service={service}
      >
        <SoundEffectsGenerator credits={credits} service={service} />
      </PageLayout>
  )
}