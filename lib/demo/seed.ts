import type { ConversationRecord, CustomerRecord } from "@/lib/data/types";

const cases = [
  ["Acme Inc.", "Sarah Chen", "Pro", 34, "High", 14, -42, "Considering cancellation", "We have not been getting enough value from the product lately. Usage across our team is down, and the billing issue from last month is still unresolved. We are thinking about canceling before our next renewal.", "Cancellation risk"],
  ["Northstar", "James Wilson", "Enterprise", 88, "Low", 92, 18, "Expanding to our EU team", "We are rolling the platform out to another 120 people in Europe next quarter. Can you help us plan the rollout?", "Expansion signal"],
  ["Pixel Labs", "Maya Patel", "Pro", 57, "Medium", 31, -12, "Question about team permissions", "Could you clarify whether guests can access project reports without a paid seat?", "Product question"],
  ["Vertex Works", "Alex Morgan", "Starter", 42, "High", 9, -36, "Billing issue still unresolved", "This is my third follow-up about the duplicate invoice on our account. We need this resolved before renewal.", "Escalation"],
  ["Brightpath", "Olivia King", "Enterprise", 73, "Low", 64, 7, "Onboarding feedback", "The onboarding session was helpful and our team is now using the automation features every day.", "Positive feedback"],
  ["Momentum", "Noah Lee", "Pro", 61, "Medium", 27, -8, "Need help with reporting", "Our leadership team cannot find the weekly usage report. Could someone walk us through it?", "Adoption risk"],
  ["Atlas Cloud", "Priya Shah", "Enterprise", 81, "Low", 118, 22, "Security review completed", "Our security team approved the platform. We are ready to discuss adding two more departments.", "Expansion signal"],
  ["Papertrail", "Daniel Kim", "Starter", 49, "Medium", 21, -19, "Integration stopped syncing", "The CRM integration has not synced since Friday and our team is starting to lose confidence.", "Technical issue"],
  ["Harbor Health", "Emma Davis", "Pro", 68, "Medium", 44, -3, "Training for new teammates", "We hired six new teammates. Do you have a recommended training path for them?", "Onboarding request"],
  ["Copper & Co.", "Liam Brooks", "Pro", 29, "High", 6, -51, "Request to downgrade", "We only have three active users now and want to downgrade before the upcoming renewal.", "Downgrade risk"],
  ["Juniper Systems", "Sofia Martinez", "Enterprise", 92, "Low", 76, 31, "API usage growing", "API usage doubled this month. Can we review higher limits and enterprise support options?", "Upsell opportunity"],
  ["Lumen Studio", "Ethan Clark", "Starter", 55, "Medium", 36, -14, "Not seeing expected results", "We completed setup but have not seen the time savings we expected. What should we change?", "Value risk"],
] as const;

export function generateDemoPortfolio(workspaceId: string) {
  const customers: CustomerRecord[] = cases.map((item, index) => {
    const [name, contact, plan, health, risk, renewalDays, change] = item;
    const id = `${workspaceId.slice(0, 8)}_customer_${index + 1}`;
    const initials = name.split(/\s+/).map((part) => part[0]).join("").replace(/[^A-Z]/g, "").slice(0, 2) || "CO";
    return {
      id,
      name,
      contact,
      email: `${contact.toLowerCase().replace(/[^a-z]+/g, ".").replace(/\.$/, "")}@${name.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 12)}.com`,
      initials,
      plan,
      health,
      risk,
      renewal: `${renewalDays} days`,
      renewalDays,
      activity: index % 3 === 0 ? "Today" : `${(index % 8) + 1} days ago`,
      change,
    };
  });

  const conversations: ConversationRecord[] = cases.map((item, index) => {
    const customer = customers[index];
    const subject = item[7];
    const body = item[8];
    return {
      id: index + 1,
      customerId: customer.id,
      customer: customer.name,
      initials: customer.initials,
      contact: customer.contact,
      subject,
      preview: body.length > 112 ? `${body.slice(0, 109)}…` : body,
      body,
      time: index === 0 ? "9:42 AM" : index < 4 ? "Today" : "This week",
      unread: index < 5,
      risk: customer.risk,
      intent: item[9],
    };
  });

  return { customers, conversations };
}
