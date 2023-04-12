import { trpc } from "@rallly/backend";
import { BellIcon } from "@rallly/icons";
import clsx from "clsx";
import { useTranslation } from "next-i18next";
import * as React from "react";

import { useLoginModal } from "@/components/auth/login-modal";
import { Button } from "@/components/button";
import { useUser } from "@/components/user-provider";
import { usePostHog } from "@/utils/posthog";
import { usePollByAdmin } from "@/utils/trpc/hooks";

import { usePoll } from "../poll-context";
import Tooltip from "../tooltip";

const NotificationsToggle: React.FunctionComponent = () => {
  const { poll } = usePoll();
  const { t } = useTranslation();

  const { data } = usePollByAdmin();
  const watchers = data.watchers ?? [];

  const { user } = useUser();
  const [isWatching, setIsWatching] = React.useState(() =>
    watchers.some(({ userId }) => userId === user.id),
  );

  const posthog = usePostHog();

  const watch = trpc.polls.watch.useMutation({
    onMutate: () => {
      setIsWatching(true);
    },
    onSuccess: () => {
      // TODO (Luke Vella) [2023-04-08]: We should have a separate query for getting watchers
      posthog?.capture("turned notifications on", {
        pollId: poll.id,
        source: "notifications-toggle",
      });
    },
  });

  const unwatch = trpc.polls.unwatch.useMutation({
    onMutate: () => {
      setIsWatching(false);
    },
    onSuccess: () => {
      posthog?.capture("turned notifications off", {
        pollId: poll.id,
        source: "notifications-toggle",
      });
    },
  });

  const { openLoginModal } = useLoginModal();

  return (
    <Tooltip
      content={
        <div className="max-w-md">
          {user.isGuest
            ? t("notificationsGuest")
            : isWatching
            ? t("notificationsOn")
            : t("notificationsOff")}
        </div>
      }
    >
      <span className="group relative inline-block">
        <Button
          data-testid="notifications-toggle"
          disabled={poll.demo}
          icon={<BellIcon />}
          className="relative"
          onClick={async () => {
            if (user.isGuest) {
              // ask to log in
              openLoginModal();
            } else {
              // toggle
              if (isWatching) {
                await unwatch.mutateAsync({ pollId: poll.id });
              } else {
                await watch.mutateAsync({ pollId: poll.id });
              }
            }
          }}
        ></Button>
        <span
          className={clsx(
            "pointer-events-none absolute rounded-full",
            isWatching
              ? "top-2 right-2 h-1.5 w-1.5  bg-green-500"
              : "inset-0 left-1/2 top-1/2 h-6 w-0.5 origin-center -translate-y-1/2 rotate-45 bg-slate-800",
            "outline outline-1 outline-gray-100 group-hover:outline-gray-200",
          )}
        />
      </span>
    </Tooltip>
  );
};

export default NotificationsToggle;
