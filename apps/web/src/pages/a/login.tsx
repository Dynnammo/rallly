import { withSessionSsr } from "@rallly/backend/next";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import React from "react";

import { getAuthLayout } from "@/components/auth/auth-layout";
import { LoginForm } from "@/components/auth/login-form";
import { NextPageWithLayout } from "@/types";

import { withPageTranslations } from "../../utils/with-page-translations";

const Page: NextPageWithLayout<{ referer: string | null }> = () => {
  const { t } = useTranslation();

  const router = useRouter();
  return (
    <>
      <Head>
        <title>{t("login")}</title>
      </Head>
      <LoginForm
        onAuthenticated={async () => {
          router.replace("/polls");
        }}
      />
    </>
  );
};

Page.getLayout = getAuthLayout;

export const getServerSideProps: GetServerSideProps = withSessionSsr(
  async (ctx) => {
    if (ctx.req.session.user?.isGuest === false) {
      return {
        redirect: { destination: "/polls" },
        props: {},
      };
    }

    return await withPageTranslations()(ctx);
  },
);

export default Page;
