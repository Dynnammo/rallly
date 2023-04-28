import { withAuthIfRequired, withSessionSsr } from "@rallly/backend/next";
import { CalendarIcon } from "@rallly/icons";
import { GetServerSideProps } from "next";

import { DragScroll } from "@/components/drag-scroll";
import { DatesTable } from "@/components/pages/poll/components/dates-table";
import { Section } from "@/components/pages/poll/components/section";
import { getAdminLayout } from "@/components/pages/poll/layout";
import { Trans } from "@/components/trans";
import { useCurrentPollOptions } from "@/contexts/current-event";
import { NextPageWithLayout } from "@/types";
import { withPageTranslations } from "@/utils/with-page-translations";

const AllDatesTable: NextPageWithLayout = () => {
  const { data: options = [] } = useCurrentPollOptions();
  return (
    <Section
      icon={CalendarIcon}
      border={true}
      title={<Trans i18nKey={"poll.dates"} defaults="Dates" />}
      subtitle={
        <Trans
          i18nKey={"poll.datesSubtitle"}
          defaults="These are the dates your participants can choose from."
        />
      }
    >
      <DragScroll>
        <DatesTable data={options} />
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
