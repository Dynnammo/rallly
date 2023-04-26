import {
  CalendarIcon,
  ChartSquareBarIcon,
  ChatIcon,
  CogIcon,
  UsersIcon,
} from "@rallly/icons";
import Head from "next/head";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import React from "react";

import SubMenuLayout from "@/components/layouts/components/sub-menu-layout";
import StandardLayout from "@/components/layouts/v3-layout";
import { PollIdProvider, useCurrentEvent } from "@/contexts/current-event";

import { NextPageWithLayout } from "../../types";

const AdminLayout = ({ children }: React.PropsWithChildren) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [urlId] = React.useState(router.query.urlId as string);

  return (
    <PollIdProvider initialValue={urlId}>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </PollIdProvider>
  );
};

const AdminLayoutInner: React.FunctionComponent<{
  children?: React.ReactNode;
}> = ({ children }) => {
  const { t } = useTranslation();

  const { data } = useCurrentEvent();

  return (
    <>
      <Head>
        <title>{data?.title}</title>
      </Head>
      <SubMenuLayout
        menuItems={[
          {
            href: `/poll/${data?.id}`,
            title: t("poll"),
            icon: ChartSquareBarIcon,
          },
          {
            href: `/poll/${data?.id}/participants`,
            title: t("participants"),
            icon: UsersIcon,
          },
          {
            href: `/poll/${data?.id}/options`,
            title: t("options"),
            icon: CalendarIcon,
          },
          {
            href: `/poll/${data?.id}/manage`,
            title: t("settings"),
            icon: CogIcon,
          },
          {
            href: `/poll/${data?.id}/options`,
            title: t("comments"),
            icon: ChatIcon,
          },
        ]}
        icon={ChartSquareBarIcon}
        title={data?.title}
      >
        {children}
      </SubMenuLayout>
    </>
  );
};

export default AdminLayout;

export const getAdminLayout: NextPageWithLayout["getLayout"] =
  function getLayout(page) {
    return (
      <StandardLayout>
        <AdminLayout>{page}</AdminLayout>
      </StandardLayout>
    );
  };
