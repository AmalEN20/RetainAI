import type { ConversationRecord, CustomerRecord } from "@/lib/data/types";

export type DemoDocumentationPack = "" | "github" | "stripe" | "google-workspace";

export type DemoWorkspace = {
  id: string;
  companyName: string;
  companyDescription: string;
  productName: string;
  documentationPack: DemoDocumentationPack;
  guideStep: number;
  completedAt: string | null;
  customerCount: number;
  conversationCount: number;
};

export type DemoSnapshot = {
  workspace: DemoWorkspace;
  customers: CustomerRecord[];
  conversations: ConversationRecord[];
  storage: "d1" | "memory";
};
