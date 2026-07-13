import { z } from "zod";
import { zodResponsesFunction } from "openai/helpers/zod";
import {
  getCustomerProfile,
  getSubscription,
  getSupportTickets,
  getUsageMetrics,
} from "./tools";

const customerIdSchema = z.object({
  customerId: z.literal("cus_acme_001"),
});

const registry = {
  get_customer_profile: {
    description: "Retrieve the customer profile, plan, relationship owner, and current health score.",
    schema: customerIdSchema,
    execute: ({ customerId }: z.infer<typeof customerIdSchema>) => getCustomerProfile(customerId),
  },
  get_usage_metrics: {
    description: "Retrieve product adoption and active-user trends for the customer.",
    schema: customerIdSchema,
    execute: ({ customerId }: z.infer<typeof customerIdSchema>) => getUsageMetrics(customerId),
  },
  get_subscription: {
    description: "Retrieve subscription status, value, renewal timing, and approved retention-credit limit.",
    schema: customerIdSchema,
    execute: ({ customerId }: z.infer<typeof customerIdSchema>) => getSubscription(customerId),
  },
  get_support_tickets: {
    description: "Retrieve open support tickets, priorities, and age for the customer.",
    schema: customerIdSchema,
    execute: ({ customerId }: z.infer<typeof customerIdSchema>) => getSupportTickets(customerId),
  },
} satisfies Record<
  string,
  {
    description: string;
    schema: typeof customerIdSchema;
    execute: (arguments_: z.infer<typeof customerIdSchema>) => unknown;
  }
>;

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

export function executeReadOnlyTool(name: string, rawArguments: unknown) {
  if (!isAgentToolName(name)) {
    throw new Error(`Tool "${name}" is not registered as read-only.`);
  }

  const tool = registry[name];
  const arguments_ = tool.schema.parse(rawArguments);
  return tool.execute(arguments_);
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
  }
}
