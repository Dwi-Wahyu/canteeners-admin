import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      username: string;
      name: string;
      avatar: string;
      role: "SUPERADMIN" | "ADMIN" | "CUSTOMER" | "SHOP_OWNER";
    };
  }

  interface User {
    id: string;
    username: string;
    name: string;
    avatar: string;
    role: "SUPERADMIN" | "ADMIN" | "CUSTOMER" | "SHOP_OWNER";
  }
}
