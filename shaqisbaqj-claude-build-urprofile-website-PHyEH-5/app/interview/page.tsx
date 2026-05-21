import type { Metadata } from "next";
import InterviewClient from "./InterviewClient";

export const metadata: Metadata = {
  title: "Story Interview — UrProfile",
};

export default function InterviewPage({
  searchParams,
}: {
  searchParams: { session?: string; demo?: string };
}) {
  const sessionToken = searchParams.session ?? null;
  const isDemo = searchParams.demo === "true";

  return <InterviewClient sessionToken={sessionToken} isDemo={isDemo} />;
}
