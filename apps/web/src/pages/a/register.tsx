import Head from "next/head";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

import { NextPageWithLayout } from "@/types";

import { getAuthLayout } from "../../components/auth/auth-layout";
import { RegisterForm } from "../../components/auth/login-form";
import { withPageTranslations } from "../../utils/with-page-translations";

const Page: NextPageWithLayout = () => {
  const { t } = useTranslation("app");
  const router = useRouter();
  return (
    <>
      <Head>
        <title>{t("register")}</title>
      </Head>
      <RegisterForm
        onRegistered={() => {
          router.replace("/profile");
        }}
      />
    </>
  );
};

Page.getLayout = getAuthLayout;

export const getServerSideProps = withPageTranslations(["common", "app"]);

export default Page;
