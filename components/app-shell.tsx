"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Bell,
  BookOpenCheck,
  Activity,
  BriefcaseBusiness,
  CheckSquare2,
  ChevronDown,
  Inbox,
  LayoutDashboard,
  MoreHorizontal,
  Search,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DemoGuide } from "@/components/demo/demo-guide";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Case Study", href: "/case-study", icon: BriefcaseBusiness },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Inbox", href: "/inbox", icon: Inbox },
  { name: "Knowledge", href: "/knowledge", icon: BookOpenCheck },
  { name: "Runs & Evals", href: "/runs", icon: Activity },
  { name: "Approvals", href: "/approvals", icon: CheckSquare2 },
];

const mobileNavigation = [
  { name: "Home", href: "/", icon: LayoutDashboard },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Inbox", href: "/inbox", icon: Inbox },
  { name: "Approvals", href: "/approvals", icon: CheckSquare2 },
];

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-[244px] flex-col bg-[#132019] px-3 py-4 text-[#dfe9e3]">
      <Link href="/" className="mb-7 flex items-center gap-2.5 px-2" onClick={onNavigate}>
        <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#48b889] text-[#102018] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.15)]">
          <Sparkles className="h-[18px] w-[18px]" strokeWidth={2.4} />
        </span>
        <span className="text-[17px] font-bold tracking-[-0.02em] text-white">RetainAI</span>
      </Link>

      <div className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[#76897e]">Workspace</div>
      <nav className="space-y-1" aria-label="Primary navigation">
        {navigation.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              data-demo-target={item.href === "/customers" ? "nav-customers" : item.href === "/inbox" ? "nav-inbox" : item.href === "/approvals" ? "nav-approvals" : undefined}
              onClick={onNavigate}
              className={cn(
                "flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors",
                active ? "bg-[#25372d] text-white" : "text-[#aebeb5] hover:bg-[#1b2c23] hover:text-white",
              )}
            >
              <Icon className="h-[17px] w-[17px]" strokeWidth={2} />
              <span className="flex-1">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-xl border border-[#2d4135] bg-[#1b2a22] p-3.5">
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#c5d4cc]">
          <Sparkles className="h-3.5 w-3.5 text-[#64cf9f]" /> Copilot status
        </div>
        <div className="flex items-center gap-2 text-[11px] text-[#8fa298]">
          <span className="h-2 w-2 rounded-full bg-[#56ce96] shadow-[0_0_0_3px_rgba(86,206,150,0.12)]" />
          AI workflow · Demo ready
        </div>
      </div>

      <button className="mt-3 flex items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-[#1b2c23]" aria-label="Open account menu">
        <Avatar initials="DM" className="h-8 w-8 bg-[#314a3d] text-white" />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-xs font-semibold text-white">Demo workspace</span>
          <span className="block truncate text-[10px] text-[#809288]">Anonymous · temporary</span>
        </span>
        <ChevronDown className="h-3.5 w-3.5 text-[#819389]" />
      </button>
    </aside>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#f4f5f0]">
      <div className="fixed inset-y-0 left-0 z-40 hidden lg:block"><Sidebar /></div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button className="absolute inset-0 bg-black/35" onClick={() => setMobileOpen(false)} aria-label="Close navigation" />
          <div className="relative h-full w-[min(86vw,320px)]">
            <Sidebar onNavigate={() => setMobileOpen(false)} />
            <Button variant="ghost" size="icon" className="absolute right-[-48px] top-3 text-white hover:bg-white/10 hover:text-white" onClick={() => setMobileOpen(false)} aria-label="Close menu"><X /></Button>
          </div>
        </div>
      )}

      <div className="lg:pl-[244px]">
        <header className="mobile-safe-top sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-white/90 px-4 backdrop-blur md:px-7">
          <Link href="/" className="flex min-h-11 items-center gap-2 lg:hidden" aria-label="RetainAI home">
            <span className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-[#177553] text-white"><Sparkles className="h-4 w-4" /></span>
            <span className="text-sm font-bold tracking-[-0.02em]">RetainAI</span>
          </Link>
          <div className="hidden max-w-[340px] flex-1 items-center gap-2 rounded-lg border bg-[#f8f9f6] px-3 text-[#7a847d] md:flex">
            <Search className="h-4 w-4" />
            <input className="h-9 w-full bg-transparent text-sm outline-none placeholder:text-[#98a098]" placeholder="Search customers, conversations…" aria-label="Search" />
            <kbd className="rounded border bg-white px-1.5 py-0.5 text-[10px] text-[#8b948e]">⌘ K</kbd>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm" className="hidden sm:inline-flex" asChild><Link href="/case-study"><BriefcaseBusiness className="h-3.5 w-3.5" /> Case study</Link></Button>
            <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
              <Bell className="h-[18px] w-[18px]" />
              <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-[#d75845] ring-2 ring-white" />
            </Button>
          </div>
        </header>
        <main className="mobile-page-bottom mx-auto w-full min-w-0 max-w-[1500px] px-4 py-5 md:px-7 md:py-7">{children}</main>
      </div>
      <nav className="mobile-bottom-nav fixed inset-x-0 bottom-0 z-40 border-t bg-white/95 backdrop-blur-lg lg:hidden" aria-label="Mobile navigation">
        <div className="mx-auto grid max-w-lg grid-cols-5 px-1 pt-1.5">
          {mobileNavigation.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                data-demo-target={item.href === "/customers" ? "nav-customers" : item.href === "/inbox" ? "nav-inbox" : item.href === "/approvals" ? "nav-approvals" : undefined}
                className={cn("flex min-h-[52px] flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-semibold", active ? "text-[#177553]" : "text-[#738078]")}
              >
                <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2} />
                <span>{item.name}</span>
              </Link>
            );
          })}
          <button onClick={() => setMobileOpen(true)} className="flex min-h-[52px] flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-semibold text-[#738078]" aria-label="Open more navigation">
            <MoreHorizontal className="h-5 w-5" />
            <span>More</span>
          </button>
        </div>
      </nav>
      <DemoGuide />
    </div>
  );
}
