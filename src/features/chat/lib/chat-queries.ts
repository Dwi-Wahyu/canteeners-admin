"use server";

import { adminDb } from "@/lib/firebase/admin";
import { Conversation } from "../types";

export async function getChatMessages(chatId: string) {
  try {
    const messagesRef = adminDb
      .collection("chats")
      .doc(chatId)
      .collection("messages");

    // Mengurutkan dari pesan terlama ke terbaru (asc) untuk tampilan chat
    const snapshot = await messagesRef.orderBy("createdAt", "asc").get();

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      if (data.createdAt) {
        data.createdAt = data.createdAt.toDate();
      }
      return {
        id: doc.id,
        ...data,
      };
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
}

export async function getChatDetail(chatId: string) {
  const doc = await adminDb.collection("chats").doc(chatId).get();
  if (!doc.exists) return null;

  const data = doc.data() as any;

  const convertTimestamps = (obj: any): any => {
    if (obj && obj._seconds !== undefined && obj._nanoseconds !== undefined) {
      return obj.toDate();
    }
    if (obj && typeof obj === "object") {
      for (const key in obj) {
        obj[key] = convertTimestamps(obj[key]);
      }
    }
    return obj;
  };

  const convertedData = convertTimestamps(data);

  return { id: doc.id, ...convertedData } as Conversation;
}

export async function getUserChats(userId: string) {
  try {
    // Inisialisasi referensi koleksi
    const chatsRef = adminDb.collection("chats");

    // Jalankan query dengan method chaining
    const snapshot = await chatsRef
      .where("participantIds", "array-contains", userId)
      .orderBy("lastMessageAt", "desc")
      .get();

    // Map hasil snapshot menjadi array objek yang bersih
    const chats = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return chats;
  } catch (error) {
    console.error("Error fetching user chats:", error);
    throw new Error("Gagal mengambil data chat");
  }
}
