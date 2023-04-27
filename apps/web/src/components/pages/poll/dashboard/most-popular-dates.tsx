import { CalendarIcon, StarIcon } from "@rallly/icons";
import dayjs from "dayjs";
import React from "react";

import { Button } from "@/components/button";
import { ButtonLink } from "@/components/pages/poll/components/button-link";
import { DateCard } from "@/components/pages/poll/components/date-card";
import { Section } from "@/components/pages/poll/components/section";
import { VoteSummary } from "@/components/pages/poll/components/vote-summary";
import { VoteSummaryProgressBar } from "@/components/pages/poll/components/vote-summary-progress-bar";
import { Trans } from "@/components/trans";
import { ParticipantAvatarBar } from "@/components/ui/participant-avatar-bar";
import {
  useCreatePollLink,
  useCurrentPollOptions,
  useCurrentPollResponses,
  useScoreByOptionId,
} from "@/contexts/current-event";

export const MostPopularDates = () => {
  const createPollLink = useCreatePollLink();
  const scoreByOptionId = useScoreByOptionId();
  const { data: options = [] } = useCurrentPollOptions();
  const { data: responses = [] } = useCurrentPollResponses();

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
      .slice(0, 3)
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
      title={<Trans i18nKey="poll.mostPopular" defaults="Most Popular" />}
      subtitle={
        <Trans
          i18nKey="poll.bestOptionsDescription"
          defaults="These are the most popular dates with your participants."
        />
      }
      actions={
        <ButtonLink
          href={createPollLink("participants")}
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
      <div className="flex divide-x">
        {bestOptions.map((option) => {
          return (
            <div
              key={option.id}
              className="grow divide-y bg-white md:basis-1/3"
            >
              <div className="flex items-start gap-4 p-4">
                <DateCard date={option.start} />
                <div>
                  <ul>
                    {option.duration ? (
                      <li>
                        <Trans
                          i18nKey="poll.startTime"
                          values={{
                            startTime: dayjs(option.start).format("LT"),
                          }}
                          components={{ b: <strong /> }}
                          defaults="<b>Start:</b> {startTime}"
                        />
                      </li>
                    ) : null}
                    <li>
                      <Trans
                        i18nKey="poll.optionDuration"
                        values={{
                          duration:
                            option.duration === 0
                              ? "All Day"
                              : dayjs
                                  .duration(option.duration, "minutes")
                                  .humanize(),
                        }}
                        components={{ b: <strong /> }}
                        defaults="<b>Duration:</b> {duration}"
                      />
                    </li>

                    <li className="mt-2">
                      <ParticipantAvatarBar
                        participants={responses.filter((response) => {
                          return scoreByOptionId[option.id].yes.includes(
                            response.id,
                          );
                        })}
                        max={5}
                      />
                    </li>
                  </ul>
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
              <div className="p-3">
                <Button className="w-full" icon={<StarIcon />}>
                  <Trans i18nKey="poll.book" defaults="Book" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
};
