export type CustomerContext = ReturnType<typeof loadCustomerContext>;

export function getCustomerProfile(customerId: string) {
  return {
    customerId,
    company: "Acme Inc.",
    contact: { name: "Sarah Chen", email: "sarah@acme.co", role: "Head of Operations" },
    plan: "Pro",
    healthScore: 34,
    relationshipOwner: "Amal Studio",
  };
}

export function getUsageMetrics(customerId: string) {
  return {
    customerId,
    activeUsers: 18,
    licensedSeats: 50,
    weeklyActiveUsersChangePercent: -42,
    lastMeaningfulActivityDaysAgo: 8,
    trendWindow: "30 days",
  };
}

export function getSubscription(customerId: string) {
  return {
    customerId,
    status: "active",
    monthlyValueUsd: 249,
    renewalInDays: 14,
    cancelAtPeriodEnd: false,
    availableRetentionCreditUsd: 125,
  };
}

export function getSupportTickets(customerId: string) {
  return {
    customerId,
    openCount: 3,
    unresolvedHighPriorityCount: 1,
    oldestOpenDays: 12,
    tickets: [
      { subject: "Duplicate invoice", status: "waiting_on_support", priority: "high" },
      { subject: "Team permissions", status: "open", priority: "normal" },
      { subject: "Usage report export", status: "open", priority: "normal" },
    ],
  };
}

export function loadCustomerContext() {
  const customerId = "cus_acme_001";
  return {
    conversation: {
      id: 1,
      subject: "Considering cancellation",
      body: "We have not been getting enough value from the product lately. Usage across our team is down, and the billing issue from last month is still unresolved. We are thinking about canceling before our next renewal.",
      receivedAt: "2026-07-13T09:42:00-07:00",
    },
    customer: getCustomerProfile(customerId),
    usage: getUsageMetrics(customerId),
    subscription: getSubscription(customerId),
    support: getSupportTickets(customerId),
  };
}
