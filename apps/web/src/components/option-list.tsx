import clsx from "clsx";
import { useTranslation } from "react-i18next";

import { DragScroll } from "@/components/drag-scroll";
import { ScoreSummary } from "@/components/poll/score-summary";
import {
  useCurrentPollOptions,
  useCurrentPollResponses,
  useScore,
} from "@/contexts/current-event";
import { useDayjs } from "@/utils/dayjs";

const TempOption = (props: { optionId: string }) => {
  const { t } = useTranslation();
  const { dayjs } = useDayjs();
  const { data: participants = [] } = useCurrentPollResponses();
  const { data: options = [] } = useCurrentPollOptions();

  const option = options.find((o) => o.id === props.optionId);
  const score = useScore(option?.id ?? "");

  const highScore = options.length; // TODO (Luke Vella) [2023-04-19]: Fix this

  if (!option) {
    return null;
  }

  const isRange = option.duration > 0;
  const start = dayjs(option.start);
  const end = isRange ? start.add(option.duration, "minutes") : null;

  return (
    <div
      role="button"
      className="hover:bg-primary-50/50 hover:text-primary-600 group relative z-10 min-w-[70px] bg-gray-100 p-3 text-center active:bg-gray-100"
    >
      <div className="absolute inset-0 -z-10">
        <div
          className={clsx(
            "group-hover:bg-primary-100/50 absolute bottom-0 w-full bg-white",
          )}
          style={{
            height: (score.yes / participants.length) * 100 + "%",
          }}
        />
      </div>

      <div className="relative z-10 space-y-3">
        <div>
          <div className="text-xl font-bold">{start.format("D")}</div>
          <div className="text-xs font-semibold uppercase">
            {start.format("MMM")}
          </div>
        </div>
        <div className="inline-block">
          <ScoreSummary
            orientation="vertical"
            yesScore={score.yes}
            highlight={highScore === score.yes}
          />
        </div>
      </div>
    </div>
  );
};
export const OptionList = (props: { className?: string }) => {
  const { data: options = [] } = useCurrentPollOptions();

  return (
    <DragScroll className={props.className}>
      <div className={clsx("flex select-none bg-gray-50")}>
        {options.map((option) => (
          <TempOption key={option.id} optionId={option.id} />
        ))}
      </div>
    </DragScroll>
  );
};
