"use client";

import * as React from "react";
import { ParticipantInfo } from "@/features/chat/types";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getImageUrl } from "@/helper/get-image-url";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

export interface SerializedConversation {
  id: string;
  participantIds: string[];
  lastMessage: string;
  lastMessageAt: number; // millisecond timestamp
  participantsInfo: Record<string, ParticipantInfo>;
}

interface ConversationListClientProps {
  initialChats: SerializedConversation[];
  currentUserId: string;
}

export default function ConversationListClient({
  initialChats,
  currentUserId,
}: ConversationListClientProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [debouncedQuery, setDebouncedQuery] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);

  // Debounce search query
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setCurrentPage(1); // Reset ke halaman pertama saat melakukan pencarian baru
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Filter percakapan berdasarkan nama partner secara case-insensitive
  const filteredChats = React.useMemo(() => {
    if (!debouncedQuery.trim()) {
      return initialChats;
    }
    const lowerQuery = debouncedQuery.toLowerCase();
    return initialChats.filter((chat) => {
      const partnerId = chat.participantIds.find((id) => id !== currentUserId);
      const partner = partnerId ? chat.participantsInfo[partnerId] : null;
      const partnerName = partner?.name || "Pengguna";
      return partnerName.toLowerCase().includes(lowerQuery);
    });
  }, [initialChats, debouncedQuery, currentUserId]);

  // Paginasi: maksimal 10 percakapan
  const itemsPerPage = 10;
  const totalPages = Math.max(
    1,
    Math.ceil(filteredChats.length / itemsPerPage),
  );

  const paginatedChats = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredChats.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredChats, currentPage]);

  return (
    <div className="space-y-4">
      {/* Input Pencarian dengan Debounce */}
      <div className="relative">
        <Input
          type="text"
          placeholder="Cari nama pengguna..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Daftar Chat */}
      <div className="flex flex-col gap-2">
        {paginatedChats.length > 0 ? (
          paginatedChats.map((chat) => {
            const partnerId = chat.participantIds.find(
              (id) => id !== currentUserId,
            );
            const partner = partnerId ? chat.participantsInfo[partnerId] : null;

            return (
              <Link
                key={chat.id}
                href={`/authenticated/percakapan/${currentUserId}/${chat.id}`}
              >
                <Card className="p-4 hover:bg-accent/50 transition-colors cursor-pointer border-muted/60">
                  <div className="flex items-center gap-4">
                    {/* Avatar Partner */}
                    <div className="relative">
                      <Avatar className="h-12 w-12 border">
                        <AvatarImage
                          src={getImageUrl(
                            "/avatar/" + (partner?.avatar || ""),
                          )}
                        />
                        <AvatarFallback>
                          {partner?.name?.substring(0, 2).toUpperCase() || "PE"}
                        </AvatarFallback>
                      </Avatar>
                      {/* Indikator Online (Opsional) */}
                      <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full" />
                    </div>

                    {/* Konten Chat */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-semibold text-sm truncate">
                          {partner?.name || "Pengguna"}
                        </h3>
                        <span className="text-[10px] text-muted-foreground">
                          {formatDistanceToNow(new Date(chat.lastMessageAt), {
                            addSuffix: true,
                            locale: id,
                          })}
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

      {/* Navigasi Paginasi */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="text-xs"
          >
            <ChevronLeft className="h-4 w-4" />
            Sebelumnya
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className="w-8 h-8 p-0 text-xs"
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
            className="text-xs"
          >
            Selanjutnya
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
