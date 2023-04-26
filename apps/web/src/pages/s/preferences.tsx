import { withAuthIfRequired, withSessionSsr } from "@rallly/backend/next";
import Head from "next/head";
import { useTranslation } from "next-i18next";

import { getProfileLayout } from "@/components/layouts/profile-layout";
import Preferences from "@/components/preferences";
import { NextPageWithLayout } from "@/types";
import { withPageTranslations } from "@/utils/with-page-translations";

const Page: NextPageWithLayout = () => {
  const { t } = useTranslation();
  return (
    <div>
      <Head>
        <title>{t("preferences")}</title>
      </Head>
      <Preferences />
    </div>
  );
};

Page.getLayout = getProfileLayout;

export const getServerSideProps = withSessionSsr([
  withAuthIfRequired,
  withPageTranslations(),
]);

export default Page;
