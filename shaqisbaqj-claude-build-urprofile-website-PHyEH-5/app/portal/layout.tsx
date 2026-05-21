import type { Metadata } from "next";
import PortalGuard from "@/components/PortalGuard";

export const metadata: Metadata = {
  title: "Portal — UrProfile",
};

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PortalGuard>{children}</PortalGuard>;
}
