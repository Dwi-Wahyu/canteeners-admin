"use server";

import { prisma } from "@/lib/prisma";

const PARTICIPANT_INCLUDE = {
  include: {
    owner: {
      include: {
        shop: true,
      },
    },
  },
};

export async function getChatMessages(chatId: string) {
  try {
    const messages = await prisma.message.findMany({
      where: { chat_id: chatId },
      orderBy: { created_at: "asc" },
    });
    return messages;
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
}

export async function getChatDetail(chatId: string) {
  try {
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        participant_one: PARTICIPANT_INCLUDE,
        participant_two: PARTICIPANT_INCLUDE,
      },
    });
    return chat;
  } catch (error) {
    console.error("Error fetching chat detail:", error);
    return null;
  }
}

export async function getUserChats(userId: string) {
  try {
    const chats = await prisma.chat.findMany({
      where: {
        OR: [
          { participant_one_id: userId },
          { participant_two_id: userId },
        ],
      },
      include: {
        participant_one: PARTICIPANT_INCLUDE,
        participant_two: PARTICIPANT_INCLUDE,
      },
      orderBy: { updated_at: "desc" },
    });
    return chats;
  } catch (error) {
    console.error("Error fetching user chats:", error);
    return [];
  }
}
