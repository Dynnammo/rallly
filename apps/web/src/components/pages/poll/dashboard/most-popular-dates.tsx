import { CalendarIcon, ClockIcon, StarIcon } from "@rallly/icons";
import dayjs from "dayjs";
import React from "react";

import { Button } from "@/components/button";
import { DragScroll } from "@/components/drag-scroll";
import { ButtonLink } from "@/components/pages/poll/components/button-link";
import { DateCard } from "@/components/pages/poll/components/date-card";
import { Section } from "@/components/pages/poll/components/section";
import { VoteSummary } from "@/components/pages/poll/components/vote-summary";
import { VoteSummaryProgressBar } from "@/components/pages/poll/components/vote-summary-progress-bar";
import { Trans } from "@/components/trans";
import { ParticipantAvatarBar } from "@/components/ui/participant-avatar-bar";
import {
  useCreatePollLink,
  useCurrentEvent,
  useCurrentPollOptions,
  useCurrentPollResponses,
  useScoreByOptionId,
} from "@/contexts/current-event";

export const MostPopularDates = () => {
  const createPollLink = useCreatePollLink();
  const scoreByOptionId = useScoreByOptionId();
  const { data: options = [] } = useCurrentPollOptions();
  const { data: responses = [] } = useCurrentPollResponses();
  const { data: event } = useCurrentEvent();

  const bestOptions = React.useMemo(() => {
    // Get top 3 options

    return Object.keys(scoreByOptionId)
      .sort((a, b) => {
        const yesScore =
          scoreByOptionId[b].yes.length - scoreByOptionId[a].yes.length;

        if (yesScore === 0) {
          // if have same amount of yes votes, check ifNeedBe
          return (
            scoreByOptionId[b].ifNeedBe.length -
            scoreByOptionId[a].ifNeedBe.length
          );
        }

        return yesScore;
      })
      .flatMap((optionId) => {
        const option = options.find((o) => o.id === optionId);
        if (option) {
          return {
            ...option,
            score: scoreByOptionId[optionId],
          };
        }

        return [];
      });
  }, [scoreByOptionId, options]);

  return (
    <Section
      icon={StarIcon}
      title={<Trans i18nKey="poll.pickDate" defaults="Pick a Date" />}
      subtitle={
        <Trans
          i18nKey="poll.bestOptionsDescription"
          defaults="When you're ready, choose the best date for your event"
        />
      }
    >
      <DragScroll className="flex gap-6 pt-6 pl-4 pb-4 pr-4 sm:pl-6 sm:pt-4">
        {bestOptions.map((option, i) => {
          return (
            <div
              key={option.id}
              className="max-w-xs shrink-0 grow basis-1/2 select-none snap-start divide-y rounded-md border bg-white shadow-sm"
            >
              <div className="p-3">
                <div className="flex flex-col items-start gap-3 md:flex-row">
                  <DateCard
                    date={option.start}
                    className="-mt-6 shrink-0 md:mt-0 md:-ml-6"
                  />
                  <div className="space-y-3 overflow-hidden">
                    <div>
                      <h3 className="truncate pr-2">{event?.title}</h3>
                      {option.duration ? (
                        <div className="flex items-center gap-1 text-gray-500">
                          <div className="">
                            {dayjs(option.start).format("LT")}
                          </div>
                          {" - "}
                          <div>
                            {dayjs(option.start)
                              .add(option.duration, "minute")
                              .format("LT")}
                          </div>
                        </div>
                      ) : null}
                    </div>
                    <div>
                      <div className="mb-2 font-medium">
                        <Trans
                          i18nKey="participantCount"
                          values={{
                            count: scoreByOptionId[option.id].yes.length,
                          }}
                        />
                      </div>
                      <ParticipantAvatarBar
                        participants={responses.filter((response) => {
                          return scoreByOptionId[option.id].yes.includes(
                            response.id,
                          );
                        })}
                        max={5}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 px-4 py-2.5">
                <div className="grow">
                  <VoteSummaryProgressBar
                    total={responses?.length || 0}
                    {...option.score}
                  />
                </div>
                <VoteSummary
                  {...scoreByOptionId[option.id]}
                  total={responses.length}
                />
              </div>
              <div className="p-2">
                <Button className="w-full" icon={<StarIcon />}>
                  <Trans i18nKey="poll.book" defaults="Book" />
                </Button>
              </div>
            </div>
          );
        })}
      </DragScroll>
    </Section>
  );
};
