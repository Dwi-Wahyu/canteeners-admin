import { Timestamp } from "firebase/firestore";

/**
 * Tipe pesan terakhir untuk mengidentifikasi konten yang ditampilkan di daftar chat
 */
export type MessageType = "TEXT" | "ORDER" | "ATTACHMENT";

/**
 * Role partisipan sesuai dengan konteks sistem kamu
 */
export type ChatUserRole = "ADMIN";

/**
 * Informasi detail setiap pengguna di dalam percakapan
 */
export interface ParticipantInfo {
  name: string;
  avatar: string;
  role: "CUSTOMER" | "SHOP_OWNER";
}

/**
 * Struktur utama untuk satu percakapan (Conversation)
 */
export interface Conversation {
  id: string; // Format: {buyerId}_{sellerId}
  participantIds: string[];

  // Informasi Pesan Terakhir
  lastMessage: string;
  lastMessageType: MessageType;
  lastMessageAt: Timestamp;
  lastMessageSenderId: string;

  /**
   * Data dinamis menggunakan ID pengguna sebagai kunci (Record)
   */

  // Info profil singkat untuk efisiensi fetch (denormalized)
  participantsInfo: Record<string, ParticipantInfo>;

  // Jumlah pesan yang belum dibaca per user
  unreadCounts: Record<string, number>;

  // Waktu terakhir user melihat room ini
  lastSeenAt: Record<string, Timestamp>;

  // Status mengetik (real-time)
  typing: Record<string, boolean>;

  // Metadata
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type Attachment = {
  url: string;
  path: string;
  contentType: string;
  size: number;
};

export type Message = {
  id: string;
  senderId: string;
  type: "TEXT" | "ORDER" | "ATTACHMENT";
  order_id?: string;
  text?: string;
  attachments?: Attachment[];
  readBy: string[];
  createdAt: Timestamp | null;
};
