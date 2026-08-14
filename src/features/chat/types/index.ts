export type MessageType = "TEXT" | "ORDER" | "ATTACHMENT";

export type ChatUserRole = "ADMIN";

export interface ParticipantInfo {
  name: string;
  avatar: string;
  role: "CUSTOMER" | "SHOP_OWNER";
}

export interface Conversation {
  id: string;
  participantIds?: string[];
  lastMessage?: string;
  last_message?: string;
  lastMessageType?: MessageType;
  last_message_type?: MessageType;
  lastMessageAt?: string | Date | number;
  last_message_at?: string | Date | number;
  lastMessageSenderId?: string;
  last_message_sender_id?: string;
  participantsInfo?: Record<string, ParticipantInfo>;
  unreadCounts?: Record<string, number>;
  unread_counts?: Record<string, number>;
  lastSeenAt?: Record<string, string | Date | number>;
  typing?: Record<string, boolean>;
  createdAt?: string | Date | number;
  created_at?: string | Date | number;
  updatedAt?: string | Date | number;
  updated_at?: string | Date | number;

  customer?: {
    id: string;
    user_id: string;
    user: {
      name: string;
      avatar: string;
    };
  };

  owner?: {
    id: string;
    user_id: string;
    shop?: {
      id: string;
      name: string;
    };
    user: {
      name: string;
      avatar: string;
    };
  };
}

export type Attachment = {
  url: string;
  path: string;
  contentType: string;
  size: number;
};

export type Message = {
  id: string;
  chat_id?: string;
  sender_id?: string;
  senderId?: string;
  type: "TEXT" | "ORDER" | "ATTACHMENT";
  order_id?: string;
  text?: string | null;
  attachments?: Attachment[];
  read_by?: string[];
  readBy?: string[];
  created_at?: string | Date | number | null;
  createdAt?: string | Date | number | null;
};
