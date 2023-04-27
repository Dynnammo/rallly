import { withAuthIfRequired, withSessionSsr } from "@rallly/backend/next";
import { GetServerSideProps } from "next";

import { getAdminLayout } from "@/components/pages/poll/layout";
import { NextPageWithLayout } from "@/types";
import { withPageTranslations } from "@/utils/with-page-translations";

const Page: NextPageWithLayout = () => {
  return <div>comments</div>;
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
