import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import type { Metadata } from "next";

import { requirePageContext } from "@/features/auth/session";
import { DashboardClient } from "@/features/tasks/components/dashboard-client";
import { taskQueryFromRecord } from "@/features/tasks/filters";
import { taskKeys } from "@/features/tasks/query-keys";
import { listTasks } from "@/features/tasks/service";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false },
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { client, user } = await requirePageContext();
  const query = taskQueryFromRecord(await searchParams);
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: taskKeys.list(query),
    queryFn: async () => {
      const result = await listTasks(client, user.id, query);
      return { data: result.tasks, meta: result.meta };
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardClient initialQuery={query} />
    </HydrationBoundary>
  );
}
