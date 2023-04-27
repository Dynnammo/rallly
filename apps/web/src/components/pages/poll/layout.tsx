import {
  CalendarIcon,
  ChartSquareBarIcon,
  ChatIcon,
  CogIcon,
  UsersIcon,
} from "@rallly/icons";
import clsx from "clsx";
import { AnimatePresence, m } from "framer-motion";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { usePrevious } from "react-use";

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
  title: () => JSX.Element;
}) => {
  const router = useRouter();
  return (
    <Link
      href={props.href}
      className={clsx(
        "flex h-10 translate-y-px items-center justify-start gap-2  pl-2.5 pr-3 font-medium tracking-tight",
        router.asPath === props.href
          ? "bg-primary-50 text-primary-600 pointer-events-none"
          : "bg-gray-100 hover:bg-gray-200 active:bg-gray-300",
      )}
    >
      <props.icon className="h-6 shrink-0" />
      {props.title()}
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
  const router = useRouter();
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

  const index = menuItems.findIndex((item) => router.asPath === item.href);

  const prev = usePrevious(index);

  const shouldReverse = prev !== undefined && prev > index;
  const multiplier = shouldReverse ? -1 : 1;

  return (
    <>
      <Head>
        <title>{data?.title}</title>
      </Head>
      <div className="border-y bg-gray-100 shadow-sm sm:rounded-md sm:border-x">
        <div className="sticky top-0 z-10 border-b bg-white p-3 sm:rounded-t-md sm:p-4">
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
          <div className={clsx("mt-4 flex gap-2")}>
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
          <AnimatePresence initial={false} exitBeforeEnter={true}>
            <m.div
              key={router.pathname.split("/")[3]}
              transition={{ duration: 0.2, type: "spring" }}
              initial={{ opacity: 0, x: -10 * multiplier }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 * multiplier }}
              className="p-2 sm:p-4"
            >
              {children}
            </m.div>
          </AnimatePresence>
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
