import { ChartSquareBarIcon, QuestionMarkCircleIcon } from "@rallly/icons";
import dayjs from "dayjs";

import { DateCardInner } from "@/components/pages/poll/components/date-card";
import { Trans } from "@/components/trans";
import { useCurrentEvent } from "@/contexts/current-event";
import { FormField } from "@/components/ui/form-field";
import { TextSummary } from "@/components/ui/text-summary";

export const PollHeader = () => {
  const { data: poll } = useCurrentEvent();

  if (!poll) {
    return null;
  }
  return (
    <div className="space-y-3 rounded-md border bg-white/60 p-3 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="-mt-6 sm:mt-0 lg:-ml-6">
          <div className="inline-flex h-14 w-14 items-center justify-center overflow-hidden rounded-md border bg-slate-800 text-center text-slate-800 shadow-sm backdrop-blur-md">
            <ChartSquareBarIcon className="h-7 text-white" />
          </div>
        </div>
        <div>
          <h1 className="text-xl leading-tight lg:text-2xl">{poll?.title}</h1>
          <p className="flex items-center gap-2 text-gray-500">
            <Trans
              defaults="Created {relativeTime}"
              values={{ relativeTime: dayjs(poll.createdAt).fromNow() }}
            />
            <span className="badge bg-green-500">
              {poll.closed ? null : (
                <Trans defaults="Open" i18nKey="poll.open" />
              )}
            </span>
          </p>
        </div>
      </div>
      <TextSummary text={poll.description ?? ""} max={120} />
    </div>
  );
};
