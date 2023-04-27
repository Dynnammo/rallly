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

import { DragScroll } from "@/components/drag-scroll";
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
        "flex items-center justify-start gap-2 pl-2.5 pr-3 font-medium tracking-tight",
        router.asPath === props.href
          ? "bg-primary-50 text-primary-600 pointer-events-none"
          : "bg-gray-100 hover:bg-gray-200 active:bg-gray-300",
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
      <div className="border-y bg-white sm:border-x lg:rounded-md lg:shadow-sm">
        <div className="rounded-t-md bg-white px-2.5 pt-2.5">
          <ButtonLink icon={ArrowLeftIcon} href="/polls">
            <Trans i18nKey="back" />
          </ButtonLink>
        </div>
        <div className="sticky top-0 space-y-4 border-b bg-white/75 p-3 backdrop-blur-md sm:px-4">
          <div className="">
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
          <div className={clsx("flex h-10 gap-2")}>
            {menuItems.map((item, i) => (
              <MenuItem
                key={i}
                href={item.href}
                icon={item.icon}
                title={item.title}
              />
            ))}
          </div>
        </div>
        <div className="overflow-hidden">
          <div className="bg-gray-100 p-2">{children}</div>
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
