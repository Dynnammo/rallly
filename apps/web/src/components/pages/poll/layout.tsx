import {
  ArrowLeftIcon,
  CalendarIcon,
  ChartSquareBarIcon,
  ChatIcon,
  ChevronLeftIcon,
  CogIcon,
  UsersIcon,
  ViewGridIcon,
} from "@rallly/icons";
import clsx from "clsx";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

import StandardLayout from "@/components/layouts/v3-layout";
import { PollHeader } from "@/components/pages/poll/header";
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
  title: () => JSX.Element | React.ReactNode;
}) => {
  const router = useRouter();
  return (
    <Link
      href={props.href}
      className={clsx(
        "flex items-center justify-start gap-2 py-1.5 px-2 font-medium tracking-tight",
        router.asPath === props.href
          ? "pointer-events-none bg-gray-200"
          : "hover:bg-gray-200 active:bg-gray-300",
      )}
    >
      <props.icon className="h-6 shrink-0" />
      <span>
        {typeof props.title === "function" ? props.title() : props.title}
      </span>
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
  const { data } = useCurrentEvent();
  const createPollLink = useCreatePollLink();
  const menuItems = [
    {
      href: createPollLink(),
      title: () => <Trans i18nKey="poll.dashboard" defaults="Dashboard" />,
      icon: ChartSquareBarIcon,
    },

    {
      href: createPollLink("dates"),
      title: () => <Trans i18nKey="poll.dates" defaults="Dates" />,
      icon: CalendarIcon,
    },
    {
      href: createPollLink("participants"),
      title: () => (
        <Trans i18nKey="poll.participants" defaults="Participants" />
      ),
      icon: UsersIcon,
    },
    {
      href: createPollLink("comments"),
      title: () => <Trans i18nKey="poll.comments" defaults="Comments" />,
      icon: ChatIcon,
    },
    {
      href: createPollLink("settings"),
      title: () => <Trans i18nKey="poll.settings" defaults="Settings" />,
      icon: CogIcon,
    },
  ];

  return (
    <>
      <Head>
        <title>{data?.title}</title>
      </Head>
      <div className="space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
          <div
            className={clsx(
              "sticky top-0 flex gap-2 lg:w-48 lg:shrink-0 lg:flex-col",
            )}
          >
            <MenuItem
              href="/polls"
              icon={ChevronLeftIcon}
              title={<Trans i18nKey="back" />}
            />
            {menuItems.map((item, i) => (
              <MenuItem
                key={i}
                href={item.href}
                icon={item.icon}
                title={item.title}
              />
            ))}
          </div>
          <div className="min-w-0 grow space-y-4">{children}</div>
        </div>
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
