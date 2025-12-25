import {
  getChatMessages,
  getChatDetail,
} from "@/features/chat/lib/chat-queries";
import { Conversation, Message } from "@/features/chat/types";
import { notFound } from "next/navigation";
import ChatRoomClient from "./chat-room-client";

export default async function ChatRoomPage({
  params,
}: {
  params: Promise<{ chat_id: string; user_id: string }>;
}) {
  const { chat_id, user_id } = await params;

  const [conversation, messages] = await Promise.all([
    getChatDetail(chat_id),
    getChatMessages(chat_id),
  ]);

  if (!conversation) {
    notFound();
  }

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col">
      <ChatRoomClient
        conversation={conversation as Conversation}
        initialMessages={messages as Message[]}
        currentUserId={user_id}
      />
    </div>
  );
}
