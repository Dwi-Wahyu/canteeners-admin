import { getUserChats } from "@/features/chat/lib/chat-queries";
import { Conversation } from "@/features/chat/types";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getImageUrl } from "@/helper/get-image-url";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

export default async function UserConversationPage({
  params,
}: {
  params: Promise<{ user_id: string }>;
}) {
  const { user_id } = await params;

  // Cast sebagai array Conversation[]
  const chats = (await getUserChats(user_id)) as Conversation[];

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Pesan</h1>
        <p className="text-sm text-muted-foreground">
          Daftar percakapan pengguna
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {chats.length > 0 ? (
          chats.map((chat) => {
            // Mencari ID lawan bicara (bukan user_id saat ini)
            const partnerId = chat.participantIds.find((id) => id !== user_id);
            const partner = partnerId ? chat.participantsInfo[partnerId] : null;

            return (
              <Link
                key={chat.id}
                href={`/authenticated/percakapan/${user_id}/${chat.id}`}
              >
                <Card className="p-4 hover:bg-accent/50 transition-colors cursor-pointer border-muted/60">
                  <div className="flex items-center gap-4">
                    {/* Avatar Partner */}
                    <div className="relative">
                      <Avatar className="h-12 w-12 border">
                        <AvatarImage src={getImageUrl(partner?.avatar || "")} />
                        <AvatarFallback>
                          {partner?.name?.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {/* Indikator Online (Opsional jika datanya ada) */}
                      <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full" />
                    </div>

                    {/* Konten Chat */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-semibold text-sm truncate">
                          {partner?.name || "Pengguna"}
                        </h3>
                        <span className="text-[10px] text-muted-foreground">
                          {formatDistanceToNow(
                            new Date(chat.lastMessageAt.toDate()),
                            {
                              addSuffix: true,
                              locale: id,
                            }
                          )}
                        </span>
                      </div>

                      <div className="flex justify-between items-center gap-2">
                        <p className="text-xs text-muted-foreground truncate flex-1">
                          {chat.lastMessage}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            <p>Belum ada percakapan.</p>
          </div>
        )}
      </div>
    </div>
  );
}
