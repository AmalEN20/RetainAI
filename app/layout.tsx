import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://retainai-copilot.amalai.chatgpt.site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "RetainAI — Customer Success Copilot",
    template: "%s · RetainAI",
  },
  description:
    "AI-assisted customer success workspace for spotting risk, preparing actions, and keeping humans in control.",
  openGraph: {
    title: "RetainAI — AI Customer Success Copilot",
    description: "Analyze risk. Plan retention. Keep humans in control.",
    type: "website",
    images: [{ url: "/og.png", width: 1731, height: 909, alt: "RetainAI customer success workflow" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "RetainAI — AI Customer Success Copilot",
    description: "Analyze risk. Plan retention. Keep humans in control.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
