import {auth} from "~/server/better-auth";
import {headers} from "next/headers";
import {redirect} from "next/navigation";
import {PageLayout} from "~/components/page-layout";
import {db} from "~/server/db";
import {getHistoryItems} from "~/lib/history";
import { TextToSpeechEditor } from "~/components/speech-synthesis/text-to-speech-editor";


export default async function TextToSpeechPage() {
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

  const service = "styletts2";

  const historyItems = await getHistoryItems(service)

  return (
      <PageLayout
        title={"Text To Speech"}
        service={service}
        showSidebar={true}
        historyItems={historyItems}
      >
        <TextToSpeechEditor service={service} credits={credits}/>
      </PageLayout>
  );
}