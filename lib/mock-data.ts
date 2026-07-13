export type RiskLevel = "High" | "Medium" | "Low";

export const customers = [
  { name: "Acme Inc.", contact: "Sarah Chen", email: "sarah@acme.co", initials: "AC", plan: "Pro", health: 34, risk: "High" as RiskLevel, renewal: "14 days", activity: "8 days ago", change: -42 },
  { name: "Northstar", contact: "James Wilson", email: "james@northstar.io", initials: "NS", plan: "Enterprise", health: 88, risk: "Low" as RiskLevel, renewal: "92 days", activity: "Today", change: 18 },
  { name: "Pixel Labs", contact: "Maya Patel", email: "maya@pixellabs.dev", initials: "PL", plan: "Pro", health: 57, risk: "Medium" as RiskLevel, renewal: "31 days", activity: "3 days ago", change: -12 },
  { name: "Vertex Works", contact: "Alex Morgan", email: "alex@vertex.work", initials: "VW", plan: "Starter", health: 42, risk: "High" as RiskLevel, renewal: "9 days", activity: "11 days ago", change: -36 },
  { name: "Brightpath", contact: "Olivia King", email: "olivia@brightpath.ai", initials: "BP", plan: "Enterprise", health: 73, risk: "Low" as RiskLevel, renewal: "64 days", activity: "Yesterday", change: 7 },
  { name: "Momentum", contact: "Noah Lee", email: "noah@momentum.com", initials: "MO", plan: "Pro", health: 61, risk: "Medium" as RiskLevel, renewal: "27 days", activity: "4 days ago", change: -8 },
];

export const conversations = [
  { id: 1, customer: "Acme Inc.", initials: "AC", contact: "Sarah Chen", subject: "Considering cancellation", preview: "We have not been getting enough value from the product lately and are thinking about canceling…", time: "9:42 AM", unread: true, risk: "High" as RiskLevel, intent: "Cancellation risk" },
  { id: 2, customer: "Pixel Labs", initials: "PL", contact: "Maya Patel", subject: "Question about team permissions", preview: "Could you clarify whether guests can access project reports without a paid seat?", time: "8:18 AM", unread: true, risk: "Medium" as RiskLevel, intent: "Product question" },
  { id: 3, customer: "Northstar", initials: "NS", contact: "James Wilson", subject: "Expanding to our EU team", preview: "We are rolling the platform out to another 120 people in Europe next quarter.", time: "Yesterday", unread: false, risk: "Low" as RiskLevel, intent: "Expansion signal" },
  { id: 4, customer: "Vertex Works", initials: "VW", contact: "Alex Morgan", subject: "Billing issue still unresolved", preview: "This is my third follow-up about the duplicate invoice on our account.", time: "Yesterday", unread: true, risk: "High" as RiskLevel, intent: "Escalation" },
];

export const approvals = [
  { id: 1, customer: "Acme Inc.", initials: "AC", action: "Send retention email", description: "Personalized response with an onboarding call and one-month account credit.", created: "12 min ago", risk: "High" as RiskLevel, owner: "Sarah Chen" },
  { id: 2, customer: "Vertex Works", initials: "VW", action: "Create escalation task", description: "Escalate duplicate billing issue to Finance with a 24-hour SLA.", created: "38 min ago", risk: "High" as RiskLevel, owner: "Alex Morgan" },
  { id: 3, customer: "Pixel Labs", initials: "PL", action: "Send product guidance", description: "Share the team permissions guide and offer a 15-minute setup session.", created: "1 hr ago", risk: "Medium" as RiskLevel, owner: "Maya Patel" },
];

export const recentActivity = [
  { title: "Cancellation risk detected", customer: "Acme Inc.", time: "12 min ago", tone: "red" },
  { title: "Expansion signal found", customer: "Northstar", time: "26 min ago", tone: "green" },
  { title: "Approval requested", customer: "Vertex Works", time: "38 min ago", tone: "amber" },
  { title: "Health score recalculated", customer: "Pixel Labs", time: "1 hr ago", tone: "blue" },
];
