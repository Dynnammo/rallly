import { withAuthIfRequired, withSessionSsr } from "@rallly/backend/next";
import { Option } from "@rallly/database";
import {
  CalendarIcon,
  ClockIcon,
  DotsHorizontalIcon,
  PlusIcon,
  StarIcon,
} from "@rallly/icons";
import { createColumnHelper } from "@tanstack/react-table";
import dayjs from "dayjs";
import { GetServerSideProps } from "next";

import { Button } from "@/components/button";
import { DragScroll } from "@/components/drag-scroll";
import { DateCard } from "@/components/pages/poll/components/date-card";
import { DatesTable } from "@/components/pages/poll/components/dates-table";
import { Section } from "@/components/pages/poll/components/section";
import { VoteSummary } from "@/components/pages/poll/components/vote-summary";
import { VoteSummaryProgressBar } from "@/components/pages/poll/components/vote-summary-progress-bar";
import { getAdminLayout } from "@/components/pages/poll/layout";
import { Trans } from "@/components/trans";
import { ParticipantAvatarBar } from "@/components/ui/participant-avatar-bar";
import {
  useCurrentPollOptions,
  useCurrentPollResponses,
  useScoreByOptionId,
} from "@/contexts/current-event";
import { NextPageWithLayout } from "@/types";
import { withPageTranslations } from "@/utils/with-page-translations";

const optionColumnHelper = createColumnHelper<{
  id: string;
  start: Date;
  duration: number;
}>();

const AllDatesTable: NextPageWithLayout = () => {
  const { data: options = [] } = useCurrentPollOptions();
  const { data: responses = [] } = useCurrentPollResponses();
  const scoreByOptionId = useScoreByOptionId();
  return (
    <Section
      icon={CalendarIcon}
      title={<Trans i18nKey={"poll.dates"} defaults="Dates" />}
      subtitle={
        <Trans
          i18nKey={"poll.datesSubtitle"}
          defaults="These are the dates your participants can choose from."
        />
      }
    >
      <DragScroll className="rounded-md border">
        <DatesTable
          layout="auto"
          data={options}
          columns={[
            optionColumnHelper.accessor(
              (row) =>
                row.duration > 0
                  ? dayjs(row.start).format("LL")
                  : dayjs(row.start).format("MMMM YYYY"),
              {
                id: "group",
                enableGrouping: true,
                cell: (info) => info.getValue(),
              },
            ),
            optionColumnHelper.accessor("start", {
              header: () => <Trans i18nKey="poll.date" defaults="Date" />,
              size: 90,
              cell: (info) =>
                info.row.original.duration ? (
                  <div className="flex items-center gap-2 whitespace-nowrap font-semibold tabular-nums">
                    <ClockIcon className="h-5" />
                    {dayjs(info.getValue()).format("LT")}
                  </div>
                ) : (
                  <DateCard date={info.getValue()} />
                ),
            }),
            optionColumnHelper.accessor("duration", {
              id: "duration",
              size: 120,
              header: () => <Trans i18nKey="duration" defaults="Duration" />,
              cell: (info) => (
                <div className="flex items-center gap-2 whitespace-nowrap text-gray-500">
                  <ClockIcon className="h-5" />
                  {info.getValue() ? (
                    dayjs.duration(info.getValue(), "minutes").humanize()
                  ) : (
                    <Trans i18nKey="allDay" defaults="All-day" />
                  )}
                </div>
              ),
            }),
            optionColumnHelper.display({
              id: "popularity",
              header: () => (
                <Trans defaults="Popularity" i18nKey="popularity" />
              ),
              size: 300,
              cell: (info) => {
                return (
                  <div className="min-w-[100px]">
                    <VoteSummaryProgressBar
                      {...scoreByOptionId[info.row.original.id]}
                      total={responses?.length}
                    />
                  </div>
                );
              },
            }),
            optionColumnHelper.display({
              id: "participants",
              size: 100,
              header: () => (
                <Trans defaults="Participants" i18nKey="participants" />
              ),
              cell: (info) => {
                return (
                  <ParticipantAvatarBar
                    participants={responses.filter((response) => {
                      return scoreByOptionId[info.row.original.id].yes.includes(
                        response.id,
                      );
                    })}
                    max={5}
                  />
                );
              },
            }),
            optionColumnHelper.display({
              id: "attendance",
              size: 100,
              header: () => null,
              cell: (info) => {
                return (
                  <VoteSummary
                    {...scoreByOptionId[info.row.original.id]}
                    total={responses?.length}
                  />
                );
              },
            }),
            optionColumnHelper.display({
              id: "book",
              size: 100,
              header: () => null,
              cell: () => (
                <div className="text-right">
                  <Button icon={<DotsHorizontalIcon />}></Button>
                </div>
              ),
            }),
          ]}
        />
      </DragScroll>
    </Section>
  );
};

const Page: NextPageWithLayout = () => {
  return (
    <div className="space-y-4">
      <AllDatesTable />
    </div>
  );
};

Page.getLayout = getAdminLayout;

export const getServerSideProps: GetServerSideProps = withSessionSsr(
  [
    withAuthIfRequired,
    withPageTranslations(),
    async (ctx) => {
      return {
        props: {
          urlId: ctx.query.urlId as string,
        },
      };
    },
  ],
  {
    onPrefetch: async (ssg, ctx) => {
      const pollId = ctx.query.urlId as string;
      await ssg.polls.get.prefetch({
        pollId,
      });
      await ssg.polls.participants.list.prefetch({
        pollId,
      });
      await ssg.polls.options.list.prefetch({
        pollId,
      });
    },
  },
);

export default Page;
