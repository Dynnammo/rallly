import { CalendarIcon, StarIcon } from "@rallly/icons";
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
      .slice(0, 2)
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
      border={true}
      icon={StarIcon}
      title={<Trans i18nKey="poll.mostPopular" defaults="Popular Dates" />}
      subtitle={
        <Trans
          i18nKey="poll.bestOptionsDescription"
          defaults="Your participants prefer these dates the most"
        />
      }
      actions={
        <ButtonLink
          href={createPollLink("dates")}
          className="w-full"
          icon={CalendarIcon}
        >
          <Trans
            i18nKey="poll.viewAllDates"
            values={{ count: options.length }}
            defaults="View {count, plural, one {# Date} other {# Dates}}"
          />
        </ButtonLink>
      }
    >
      <DragScroll className="p-3">
        <div className="flex gap-3">
          {bestOptions.map((option) => {
            return (
              <div
                key={option.id}
                className="max-w-xs shrink-0 grow basis-72 select-none divide-y rounded-md border bg-white shadow-sm"
              >
                <div className="space-y-2 p-3">
                  <div className="flex items-start gap-4">
                    <DateCard date={option.start} className="shrink-0" />
                    <div className="overflow-hidden">
                      <h3 className="truncate">{event?.title}</h3>
                      {option.duration ? (
                        <ul className="flex justify-between gap-4">
                          <li className="font-semibold">
                            {dayjs(option.start).format("LT")}
                          </li>
                          <li className="text-gray-500">
                            {dayjs
                              .duration(option.duration, "minutes")
                              .humanize()}
                          </li>
                        </ul>
                      ) : null}
                      <div>
                        <div className="mb-2 text-gray-500">
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
        </div>
      </DragScroll>
    </Section>
  );
};
