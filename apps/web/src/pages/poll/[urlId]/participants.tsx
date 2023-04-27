import { withAuthIfRequired, withSessionSsr } from "@rallly/backend/next";
import { UsersIcon } from "@rallly/icons";
import { GetServerSideProps } from "next";

import { ParticipantsTable } from "@/components/pages/poll/components/participants-table";
import { Section } from "@/components/pages/poll/components/section";
import { getAdminLayout } from "@/components/pages/poll/layout";
import { Trans } from "@/components/trans";
import { useCurrentPollResponses } from "@/contexts/current-event";
import { NextPageWithLayout } from "@/types";
import { withPageTranslations } from "@/utils/with-page-translations";

const Page: NextPageWithLayout = () => {
  const { data: responses = [] } = useCurrentPollResponses();
  return (
    <div>
      <Section
        icon={UsersIcon}
        title={<Trans defaults="All Participants" i18nKey="participants" />}
        subtitle={<Trans defaults="" />}
      >
        <ParticipantsTable data={responses} />
      </Section>
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
