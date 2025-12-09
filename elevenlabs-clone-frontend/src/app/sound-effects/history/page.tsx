import {PageLayout} from "~/components/page-layout";
import {auth} from "~/server/better-auth";
import {headers} from "next/headers";
import {redirect} from "next/navigation";
import {getHistoryItems} from "~/lib/history";
import { HistoryList } from "~/components/sound-effects/history-list";

export default async function SoundEffectsGeneratePage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) redirect("/auth/sign-in")

  const service = "make-an-audio"

  const historyItems = await getHistoryItems(service);

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
        <HistoryList historyItems={historyItems} />
      </PageLayout>
  )
}