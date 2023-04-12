import { withAuthIfRequired, withSessionSsr } from "@rallly/backend/next";
import { ViewGridAddIcon } from "@rallly/icons";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useTranslation } from "next-i18next";

import CreatePoll from "@/components/create-poll";
import { Breadcrumbs } from "@/components/layouts/standard-layout/breadcrumbs";

import StandardLayout from "../components/layouts/v3-layout";
import { NextPageWithLayout } from "../types";
import { withPageTranslations } from "../utils/with-page-translations";

const Page: NextPageWithLayout = () => {
  const { t } = useTranslation();
  return (
    <>
      <Head>
        <title>{t("createNew")}</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <Breadcrumbs title={t("newPoll")} icon={ViewGridAddIcon} />
      <CreatePoll />
    </>
  );
};

Page.getLayout = function getLayout(page) {
  return <StandardLayout>{page}</StandardLayout>;
};

export default Page;

export const getServerSideProps: GetServerSideProps = withSessionSsr([
  withAuthIfRequired,
  withPageTranslations(),
]);
