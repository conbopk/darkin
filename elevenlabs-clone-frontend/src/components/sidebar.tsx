"use client";

import { UserButton } from "@daveyplate/better-auth-ui";
import { PanelLeft } from "lucide-react";
import { usePathname } from "next/navigation";
import {type ReactNode, useState} from "react";
import {
  IoChatboxOutline,
  IoMicOutline,
  IoMusicalNotesOutline,
  IoPinOutline
} from "react-icons/io5";
import Link from "next/link";


export default function Sidebar({ isMobile = false }: { isMobile?: boolean }) {
  const pathname = usePathname();
  const [isPinned, setIsPinned] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const isExpanded = isMobile || isPinned || isHovered

  return (
      <div
          className={`${isExpanded ? "w-64" : "w-16"} flex h-full flex-col border-r border-gray-200 bg-white px-3 py-4 transition-all duration-300`}
          onMouseEnter={() => !isMobile && setIsHovered(true)}
          onMouseLeave={() => !isMobile && setIsHovered(false)}
      >
        <div className="flex items-center justify-between px-2 mt pb-8 border-b-2">
          <h1 className={`text-xl font-bold uppercase antialiased tracking-widest ${!isExpanded && "hidden"}`}>
            Darkin
          </h1>

          {!isMobile && (
              <button
                  onClick={() => setIsPinned(!isPinned)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg transition-all hover:bg-gray-100"
                  title={isPinned ? "Unpin sidebar" : "Pin sidebar"}
              >
                <div
                    className={`flex h-8 w-8 items-center justify-center transition-all ${isPinned ? "rounded-lg bg-gray-200" : "text-gray-500"}`}
                >
                  {isExpanded ? (
                      <IoPinOutline className="h-5 w-5" />
                  ) : (
                      <PanelLeft className='h-5 w-5'/>
                  )}
                </div>
              </button>
          )}
        </div>

        {/*Navigation*/}
        <nav className='flex flex-1 flex-col'>
          <SelectionHeader isExpanded={isExpanded}>Playground</SelectionHeader>

          <SidebarButton
              icon={<IoChatboxOutline />}
              isExpanded={isExpanded}
              isActive={pathname.includes("/speech-synthesis/text-to-speech")}
              href="/speech-synthesis/text-to-speech"
          >
            Text to Speech
          </SidebarButton>

          <SidebarButton
              icon={<IoMicOutline />}
              isExpanded={isExpanded}
              isActive={pathname.includes("/speech-synthesis/speech-to-speech")}
              href="/speech-synthesis/speech-to-speech"
          >
            Voice Changer
          </SidebarButton>

          <SidebarButton
              icon={<IoMusicalNotesOutline />}
              isExpanded={isExpanded}
              isActive={pathname.includes("/sound-effects")}
              href="/sound-effects/generate"
          >
            Sound Effects
          </SidebarButton>
        </nav>

        {/*User Button*/}
        <UserButton
            size='default'
            variant='outline'
            className={`flex w-full overflow-hidden transition-all duration-300 ${isExpanded ? "opacity-100" : `w-0 opacity-0`}`}
        />
      </div>
  )
}

function SelectionHeader({
  children,
  isExpanded
}: {
  children: ReactNode;
  isExpanded: boolean;
}) {
  return (
      <div className='mb-2 mt-4 h-6 pl-4'>
        <span className={`text-sm text-gray-500 transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0"}`}>
          {children}
        </span>
      </div>
  );
}

function SidebarButton({
  icon,
  children,
  isExpanded,
  isActive,
  href,
}: {
  icon: ReactNode;
  children: ReactNode;
  isExpanded: boolean;
  isActive: boolean;
  href: string;
}) {
  return (
      <Link href={href} className={`flex w-full items-center mb-1 rounded-lg px-2.5 py-2 text-sm transition-all ${isActive ? "bg-gray-100 font-medium" : "text-gray-600 hover:bg-gray-50"}`}>
        <div className='flex h-5 w-5 flex-shrink-0 items-center justify-center'>
          {icon}
        </div>
        <div
          className={`ml-3 overflow-hidden transition-all duration-300 ${isExpanded ? "w-auto opacity-100" : "w-0 opacity-0"}`}
          style={{ whiteSpace: "nowrap" }}
        >
          {children}
        </div>
      </Link>
  )
}