import {
  CalendarIcon,
  ChartSquareBarIcon,
  ChatIcon,
  CogIcon,
  UsersIcon,
} from "@rallly/icons";
import clsx from "clsx";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import React from "react";

import StandardLayout from "@/components/layouts/v3-layout";
import { Trans } from "@/components/trans";
import {
  PollIdProvider,
  useCreatePollLink,
  useCurrentEvent,
} from "@/contexts/current-event";

import { NextPageWithLayout } from "../../../types";

const MenuItem = (props: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
}) => {
  const router = useRouter();
  return (
    <Link
      href={props.href}
      className={clsx(
        "btn-default flex h-10 translate-y-px items-center justify-start gap-2 px-2.5",
        {
          "pointer-events-none bg-gray-100": router.asPath === props.href,
        },
      )}
    >
      <props.icon className="h-5 shrink-0" />
      {props.title}
    </Link>
  );
};

const AdminLayout = ({ children }: React.PropsWithChildren) => {
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

  const createPollLink = useCreatePollLink();

  return (
    <>
      <Head>
        <title>{data?.title}</title>
      </Head>
      <div className="rounded-md border bg-gray-50 shadow-sm">
        <div className="sticky top-0 z-10 rounded-t-md border-b bg-white p-4">
          <div className="">
            <h1 className="text-xl tracking-tight md:text-2xl">
              {data?.title}
            </h1>
            <p className="text-gray-500">
              <Trans
                i18nKey="poll.createdAt"
                values={{ createdAt: data?.createdAt }}
                defaults="Created {createdAt, date, medium}"
              />
            </p>
          </div>
          <div className={clsx("mt-4 flex gap-2")}>
            {[
              {
                href: createPollLink(),
                title: <Trans i18nKey="poll.dashboard" defaults="Dashboard" />,
                icon: ChartSquareBarIcon,
              },

              {
                href: createPollLink("dates"),
                title: <Trans i18nKey="poll.dates" defaults="Dates" />,
                icon: CalendarIcon,
              },
              {
                href: createPollLink("participants"),
                title: (
                  <Trans i18nKey="poll.participants" defaults="Participants" />
                ),
                icon: UsersIcon,
              },
              {
                href: createPollLink("comments"),
                title: <Trans i18nKey="poll.comments" defaults="Comments" />,
                icon: ChatIcon,
              },
              {
                href: createPollLink("settings"),
                title: <Trans i18nKey="poll.settings" defaults="Settings" />,
                icon: CogIcon,
              },
            ]?.map((item, i) => (
              <MenuItem
                key={i}
                href={item.href}
                icon={item.icon}
                title={item.title}
              />
            ))}
          </div>
        </div>
        <div className="p-4">{children}</div>
      </div>
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
