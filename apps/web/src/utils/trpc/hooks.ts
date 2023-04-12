import { trpc } from "@rallly/backend";
import { useRouter } from "next/router";
import React from "react";

export const usePollByAdmin = () => {
  const router = useRouter();
  const [adminUrlId] = React.useState(router.query.urlId as string);
  const pollQuery = trpc.polls.getByAdminUrlId.useQuery({ urlId: adminUrlId });

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return { ...pollQuery, data: pollQuery.data! };
};
