import { z } from "zod";
import { zodResponsesFunction } from "openai/helpers/zod";
import {
  getCustomerProfile,
  getSubscription,
  getSupportTickets,
  getUsageMetrics,
} from "./tools";
import { searchKnowledgeBase } from "@/lib/knowledge/search";

const customerIdSchema = z.object({
  customerId: z.literal("cus_acme_001"),
});

const knowledgeSearchSchema = z.object({
  query: z.string().min(3).max(300),
  limit: z.number().int().min(1).max(5).default(3),
});

function defineTool<TSchema extends z.ZodType>(tool: {
  description: string;
  schema: TSchema;
  execute: (arguments_: z.infer<TSchema>) => unknown;
}) {
  return tool;
}

const registry = {
  get_customer_profile: defineTool({
    description: "Retrieve the customer profile, plan, relationship owner, and current health score.",
    schema: customerIdSchema,
    execute: ({ customerId }: z.infer<typeof customerIdSchema>) => getCustomerProfile(customerId),
  }),
  get_usage_metrics: defineTool({
    description: "Retrieve product adoption and active-user trends for the customer.",
    schema: customerIdSchema,
    execute: ({ customerId }: z.infer<typeof customerIdSchema>) => getUsageMetrics(customerId),
  }),
  get_subscription: defineTool({
    description: "Retrieve subscription status, value, renewal timing, and approved retention-credit limit.",
    schema: customerIdSchema,
    execute: ({ customerId }: z.infer<typeof customerIdSchema>) => getSubscription(customerId),
  }),
  get_support_tickets: defineTool({
    description: "Retrieve open support tickets, priorities, and age for the customer.",
    schema: customerIdSchema,
    execute: ({ customerId }: z.infer<typeof customerIdSchema>) => getSupportTickets(customerId),
  }),
  search_knowledge_base: defineTool({
    description: "Search approved company policies, playbooks, and product guides. Use this before recommending cancellation, billing, credits, onboarding, or retention actions.",
    schema: knowledgeSearchSchema,
    execute: ({ query, limit }: z.infer<typeof knowledgeSearchSchema>) => searchKnowledgeBase(query, limit),
  }),
};

export type AgentToolName = keyof typeof registry;

export const readOnlyAgentTools = Object.entries(registry).map(([name, tool]) =>
  zodResponsesFunction({
    name,
    description: tool.description,
    parameters: tool.schema,
  }),
);

export function isAgentToolName(name: string): name is AgentToolName {
  return name in registry;
}

export async function executeReadOnlyTool(name: string, rawArguments: unknown) {
  if (!isAgentToolName(name)) {
    throw new Error(`Tool "${name}" is not registered as read-only.`);
  }

  const tool = registry[name] as { schema: z.ZodType; execute: (arguments_: unknown) => unknown };
  const arguments_ = tool.schema.parse(rawArguments);
  return await tool.execute(arguments_);
}

export function summarizeToolOutput(name: AgentToolName, output: unknown) {
  const value = output as Record<string, unknown>;
  switch (name) {
    case "get_customer_profile":
      return `${value.company} · ${value.plan} plan · Health ${value.healthScore}`;
    case "get_usage_metrics":
      return `Weekly active usage ${value.weeklyActiveUsersChangePercent}% · ${value.activeUsers}/${value.licensedSeats} seats active`;
    case "get_subscription":
      return `Renewal in ${value.renewalInDays} days · $${value.monthlyValueUsd} MRR`;
    case "get_support_tickets":
      return `${value.openCount} open tickets · oldest ${value.oldestOpenDays} days`;
    case "search_knowledge_base": {
      const matches = output as Array<{ citation: string }>;
      return `${matches.length} policy chunks · ${matches.map((match) => match.citation).join("; ")}`;
    }
  }
}
