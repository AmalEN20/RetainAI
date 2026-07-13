import { getSupabaseAdmin } from "@/lib/data/supabase";

const profileFallback = (customerId: string) => ({
    customerId,
    company: "Acme Inc.",
    contact: { name: "Sarah Chen", email: "sarah@acme.co", role: "Head of Operations" },
    plan: "Pro",
    healthScore: 34,
    relationshipOwner: "Amal Studio",
  });

export async function getCustomerProfile(customerId: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return profileFallback(customerId);
  const { data, error } = await supabase.from("customers").select("*").eq("id", customerId).maybeSingle();
  if (error || !data) return profileFallback(customerId);
  return {
    customerId,
    company: data.name,
    contact: { name: data.contact_name, email: data.contact_email, role: "Customer contact" },
    plan: data.plan,
    healthScore: data.health_score,
    relationshipOwner: "Amal Studio",
  };
}

const usageFallback = (customerId: string) => ({
    customerId,
    activeUsers: 18,
    licensedSeats: 50,
    weeklyActiveUsersChangePercent: -42,
    lastMeaningfulActivityDaysAgo: 8,
    trendWindow: "30 days",
  });

export async function getUsageMetrics(customerId: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return usageFallback(customerId);
  const { data, error } = await supabase.from("customer_usage").select("*").eq("customer_id", customerId).maybeSingle();
  if (error || !data) return usageFallback(customerId);
  return {
    customerId,
    activeUsers: data.active_users,
    licensedSeats: data.licensed_seats,
    weeklyActiveUsersChangePercent: data.weekly_active_users_change_percent,
    lastMeaningfulActivityDaysAgo: data.last_meaningful_activity_days_ago,
    trendWindow: data.trend_window,
  };
}

const subscriptionFallback = (customerId: string) => ({
    customerId,
    status: "active",
    monthlyValueUsd: 249,
    renewalInDays: 14,
    cancelAtPeriodEnd: false,
    availableRetentionCreditUsd: 125,
  });

export async function getSubscription(customerId: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return subscriptionFallback(customerId);
  const { data, error } = await supabase.from("subscriptions").select("*").eq("customer_id", customerId).maybeSingle();
  if (error || !data) return subscriptionFallback(customerId);
  return {
    customerId,
    status: data.status,
    monthlyValueUsd: data.monthly_value_usd,
    renewalInDays: data.renewal_in_days,
    cancelAtPeriodEnd: data.cancel_at_period_end,
    availableRetentionCreditUsd: data.available_retention_credit_usd,
  };
}

const supportFallback = (customerId: string) => ({
    customerId,
    openCount: 3,
    unresolvedHighPriorityCount: 1,
    oldestOpenDays: 12,
    tickets: [
      { subject: "Duplicate invoice", status: "waiting_on_support", priority: "high" },
      { subject: "Team permissions", status: "open", priority: "normal" },
      { subject: "Usage report export", status: "open", priority: "normal" },
    ],
  });

export async function getSupportTickets(customerId: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return supportFallback(customerId);
  const { data, error } = await supabase.from("support_tickets").select("*").eq("customer_id", customerId);
  if (error || !data?.length) return supportFallback(customerId);
  return {
    customerId,
    openCount: data.filter((ticket) => ticket.status !== "resolved").length,
    unresolvedHighPriorityCount: data.filter((ticket) => ticket.status !== "resolved" && ticket.priority === "high").length,
    oldestOpenDays: Math.max(...data.map((ticket) => ticket.opened_days_ago)),
    tickets: data.map((ticket) => ({ subject: ticket.subject, status: ticket.status, priority: ticket.priority })),
  };
}
