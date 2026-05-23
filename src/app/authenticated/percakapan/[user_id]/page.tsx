import { getUserChats } from "@/features/chat/lib/chat-queries";
import { Conversation } from "@/features/chat/types";
import ConversationListClient, { SerializedConversation } from "./conversation-list-client";

export const dynamic = "force-dynamic";

export default async function UserConversationPage({
  params,
}: {
  params: Promise<{ user_id: string }>;
}) {
  const { user_id } = await params;

  // Cast sebagai array Conversation[]
  const chats = (await getUserChats(user_id)) as Conversation[];

  // Serialisasi chats agar dapat dikirim ke Client Component (karena Firestore Timestamp tidak serializable)
  const serializedChats: SerializedConversation[] = chats.map((chat) => ({
    id: chat.id,
    participantIds: chat.participantIds,
    lastMessage: chat.lastMessage,
    lastMessageAt: chat.lastMessageAt ? chat.lastMessageAt.toDate().getTime() : Date.now(),
    participantsInfo: chat.participantsInfo,
  }));

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Pesan</h1>
        <p className="text-sm text-muted-foreground">
          Daftar percakapan pengguna
        </p>
      </div>

      <ConversationListClient initialChats={serializedChats} currentUserId={user_id} />
    </div>
  );
}
