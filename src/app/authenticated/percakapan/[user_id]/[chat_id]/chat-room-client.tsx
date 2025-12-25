"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getImageUrl } from "@/helper/get-image-url";
import { Conversation } from "@/features/chat/types";
import { useEffect, useRef } from "react";
import { format } from "date-fns";
import { useRouter } from "nextjs-toploader/app";
import { ChevronLeft } from "lucide-react";

export default function ChatRoomClient({
  conversation,
  initialMessages,
  currentUserId,
}: {
  conversation: Conversation;
  initialMessages: any[];
  currentUserId: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll ke bawah
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [initialMessages]);

  // Cari partner (lawan chat)
  const partnerId = conversation.participantIds.find(
    (id) => id !== currentUserId
  );
  const partnerInfo = partnerId
    ? conversation.participantsInfo[partnerId]
    : null;

  const router = useRouter();

  return (
    <>
      {/* Header Chat */}
      <div>
        <button
          onClick={router.back}
          className="text-muted-foreground flex items-center gap-2 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          Kembali
        </button>
      </div>

      {/* Area Pesan */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6">
        {initialMessages.map((msg: any) => {
          const isMe = msg.senderId === currentUserId;
          const senderInfo = conversation.participantsInfo[msg.senderId];

          return (
            <div
              key={msg.id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex gap-3 max-w-[80%] ${
                  isMe ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {/* Avatar untuk setiap pesan */}
                <Avatar className="h-8 w-8 shrink-0 mt-4">
                  <AvatarImage src={getImageUrl(senderInfo?.avatar || "")} />
                  <AvatarFallback>{senderInfo?.name?.[0]}</AvatarFallback>
                </Avatar>

                {/* Bubble + Nama + Waktu */}
                <div
                  className={`space-y-1 ${
                    isMe ? "items-end" : "items-start"
                  } flex flex-col`}
                >
                  {/* Nama pengirim untuk setiap pesan */}
                  {senderInfo && (
                    <p className="text-xs text-slate-500 px-1">
                      {senderInfo.name}
                    </p>
                  )}

                  {/* Bubble pesan */}
                  <div
                    className={`
                      px-4 py-2 rounded-2xl text-sm shadow-sm
                      ${
                        isMe
                          ? "bg-primary text-primary-foreground rounded-tr-none"
                          : "bg-white text-slate-800 rounded-tl-none border border-slate-200"
                      }
                    `}
                  >
                    {msg.text}
                  </div>

                  {/* Waktu */}
                  <p
                    className={`text-[10px] text-muted-foreground px-1 ${
                      isMe ? "text-right" : "text-left"
                    }`}
                  >
                    {msg.createdAt && format(new Date(msg.createdAt), "HH:mm")}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
