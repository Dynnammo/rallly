import { trpc } from "@rallly/backend";
import { withAuthIfRequired, withSessionSsr } from "@rallly/backend/next";
import {
  ArrowRightIcon,
  ChartSquareBarIcon,
  LockClosedIcon,
  ViewGridAddIcon,
  ViewGridIcon,
} from "@rallly/icons";
import { createColumnHelper } from "@tanstack/react-table";
import clsx from "clsx";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { Trans, useTranslation } from "next-i18next";

import { DragScroll } from "@/components/drag-scroll";
import { Breadcrumbs } from "@/components/layouts/standard-layout/breadcrumbs";
import { getStandardLayout } from "@/components/layouts/v3-layout";
import { Table } from "@/components/table";
import { ParticipantAvatarBar } from "@/components/ui/participant-avatar-bar";
import { useDayjs } from "@/utils/dayjs";

import { NextPageWithLayout } from "../types";
import { withPageTranslations } from "../utils/with-page-translations";

const CreateNewButton = () => {
  const { t } = useTranslation("app");
  return (
    <Link href="/new" className="btn-primary gap-2">
      {t("create")}
    </Link>
  );
};

const EmptyState = () => {
  return (
    <div className="p-8">
      <div className="mx-auto max-w-lg rounded-md border border-dashed border-gray-200 p-8 text-center">
        <div className="mb-4">
          <ViewGridAddIcon className="inline-block h-12" />
        </div>
        <div className="font-semibold leading-relaxed">No polls</div>
        <div className="mb-4 leading-relaxed text-gray-400">
          Get started by creating a new poll.
        </div>
        <div>
          <CreateNewButton />
        </div>
      </div>
    </div>
  );
};

type PollTableRow = {
  id: string;
  title: string;
  createdAt: Date;
  closed: boolean;
  adminUrlId: string;
  participants: { name: string }[];
};

const columnHelper = createColumnHelper<PollTableRow>();

const Page: NextPageWithLayout = () => {
  const { t } = useTranslation("app");

  const columns = [
    columnHelper.accessor("title", {
      header: () => <Trans t={t} i18nKey="title" />,
      size: 300,
      cell: (info) => (
        <div className="flex items-center gap-2">
          <ChartSquareBarIcon className="text-primary-600 h-7 shrink-0" />
          <Link
            href={`/poll/${info.row.original.id}`}
            className="btn-default group inline-flex min-w-0 items-center gap-2 pr-4 font-medium"
          >
            <span className="truncate">{info.getValue()}</span>
            <ArrowRightIcon
              className={clsx(
                "h-4 transition-all",
                "opacity-0 group-hover:opacity-100",
                "-translate-x-4 group-hover:translate-x-0",
                "group-focus:translate-x-1",
              )}
            />
          </Link>
        </div>
      ),
    }),
    columnHelper.accessor("participants", {
      header: () => <Trans t={t} i18nKey="participants" />,
      size: 160,
      cell: (info) => (
        <ParticipantAvatarBar
          pollId={info.row.original.id}
          participants={info.getValue()}
          max={5}
        />
      ),
    }),
    columnHelper.accessor("createdAt", {
      header: () => <Trans t={t} i18nKey="dateCreated" />,
      size: 120,
      cell: (info) => (
        <span className="text-slate-500">
          {dayjs(info.getValue()).format("L")}
        </span>
      ),
    }),
    columnHelper.accessor("closed", {
      header: () => (
        <div className="text-center">
          <Trans t={t} i18nKey="status" />
        </div>
      ),
      size: 70,
      cell: (info) =>
        info.getValue() ? (
          <LockClosedIcon className="mx-auto block h-5 text-rose-500" />
        ) : null,
    }),
  ];

  const { data: polls = [] } = trpc.polls.list.useQuery();
  const { dayjs } = useDayjs();

  return (
    <>
      <Head>
        <title>{t("myPolls")}</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <div className="card">
        <Breadcrumbs title={t("myPolls")} icon={ViewGridIcon} />
        <div>
          {polls.length > 0 ? (
            <Table
              layout="auto"
              data={polls}
              className="max-w-full overflow-auto"
              columns={columns}
            />
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </>
  );
};

Page.getLayout = getStandardLayout;

export default Page;

export const getServerSideProps: GetServerSideProps = withSessionSsr(
  [withAuthIfRequired, withPageTranslations(["common", "app"])],
  {
    onPrefetch: async (ssg) => {
      await ssg.polls.list.prefetch();
    },
  },
);
