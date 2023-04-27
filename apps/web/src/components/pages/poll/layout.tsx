import {
  ArrowLeftIcon,
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
import React from "react";

import StandardLayout from "@/components/layouts/v3-layout";
import { ButtonLink } from "@/components/pages/poll/components/button-link";
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
  title: () => JSX.Element;
}) => {
  const router = useRouter();
  return (
    <Link
      href={props.href}
      className={clsx(
        "flex w-48 items-center justify-start gap-2 py-1.5 px-2 font-medium tracking-tight",
        router.asPath === props.href
          ? "bg-primary-50 text-primary-600 pointer-events-none"
          : "hover:bg-gray-200 active:bg-gray-300",
      )}
    >
      <props.icon className="h-6 shrink-0" />
      <span>{props.title()}</span>
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
        <div className="space-y-4">
          <Link
            href="/polls"
            className="inline-flex items-center gap-2 font-medium tracking-tight text-slate-500 hover:text-slate-800"
          >
            <ArrowLeftIcon className="h-4" />
            <Trans i18nKey="back" />
          </Link>
          <div>
            <h1 className="text-lg leading-tight tracking-tight md:text-2xl">
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
        </div>
        <div className="flex gap-6">
          <div className={clsx("flex flex-col gap-2")}>
            {menuItems.map((item, i) => (
              <MenuItem
                key={i}
                href={item.href}
                icon={item.icon}
                title={item.title}
              />
            ))}
          </div>
          <div className="grow">{children}</div>
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
