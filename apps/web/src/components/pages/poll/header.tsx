import { ChartSquareBarIcon } from "@rallly/icons";
import dayjs from "dayjs";

import { DateCardInner } from "@/components/pages/poll/components/date-card";
import { Trans } from "@/components/trans";
import { useCurrentEvent } from "@/contexts/current-event";

export const PollHeader = () => {
  const { data: poll } = useCurrentEvent();

  if (!poll) {
    return null;
  }
  return (
    <div className="flex gap-4">
      <div>
        <DateCardInner />
      </div>
      <div>
        <h1 className="lg:text-2xl">{poll?.title}</h1>
        <p className="flex items-center gap-2 text-gray-500">
          <Trans
            defaults="Created {relativeTime}"
            values={{ relativeTime: dayjs(poll.createdAt).fromNow() }}
          />
          <span className="badge bg-green-500">
            {poll.closed ? null : <Trans defaults="Open" i18nKey="poll.open" />}
          </span>
        </p>
      </div>
    </div>
  );
};
