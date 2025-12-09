"use client"

import { useRouter } from "next/navigation";
import type {ReactNode} from "react";
import {AuthUIProvider} from "@daveyplate/better-auth-ui";
import {authClient} from "~/server/better-auth/client";
import Link from "next/link";
import {Toaster} from "~/components/ui/sonner";

export function Providers({ children }: {children: ReactNode}) {
  const router = useRouter()

  return (
      <AuthUIProvider
        authClient={authClient}
        navigate={(url) => router.push(url)}
        replace={(url) => router.replace(url)}
        onSessionChange={() => {
          // Clear router cache (protected routes)
          router.refresh()
        }}
        Link={Link}
      >
        {children}
        <Toaster />
      </AuthUIProvider>
  )
}