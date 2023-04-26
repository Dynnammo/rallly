import { withAuthIfRequired, withSessionSsr } from "@rallly/backend/next";
import { Participant, Vote } from "@rallly/database";
import { CalendarIcon, DotsHorizontalIcon } from "@rallly/icons";
import { createColumnHelper } from "@tanstack/react-table";
import clsx from "clsx";
import dayjs from "dayjs";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import React from "react";
import toast from "react-hot-toast";
import { useCopyToClipboard } from "react-use";

import { Button } from "@/components/button";
import { DragScroll } from "@/components/drag-scroll";
import { getAdminLayout } from "@/components/layouts/admin-layout";
import { ScoreSummary } from "@/components/poll/score-summary";
import UserAvatar from "@/components/poll/user-avatar";
import VoteIcon from "@/components/poll/vote-icon";
import { Table } from "@/components/table";
import { Trans } from "@/components/trans";
import {
  useCreatePollLink,
  useCurrentEvent,
  useCurrentPollOptions,
  useCurrentPollResponses,
  useScore,
} from "@/contexts/current-event";
import { withPageTranslations } from "@/utils/with-page-translations";

import { NextPageWithLayout } from "../../types";

export const CopyLink = () => {
  const { data: poll } = useCurrentEvent();
  const { t } = useTranslation();

  const participantUrl = `${window.location.origin}/p/${poll?.participantUrlId}`;
  const [didCopy, setDidCopy] = React.useState(false);

  const [state, copyToClipboard] = useCopyToClipboard();

  React.useEffect(() => {
    if (state.error) {
      toast.error(`Unable to copy value: ${state.error.message}`);
    }
  }, [state]);

  return (
    <div className="relative">
      <input
        readOnly={true}
        className={clsx(
          "w-full rounded-md border p-2 text-slate-600 transition-colors",
          {
            "bg-slate-50 opacity-75": didCopy,
          },
        )}
        value={participantUrl}
      />
      <button
        disabled={didCopy}
        onClick={() => {
          copyToClipboard(participantUrl);
          setDidCopy(true);
          setTimeout(() => {
            setDidCopy(false);
          }, 1000);
        }}
        className="absolute top-1/2 right-3 -translate-y-1/2 font-semibold text-slate-800"
      >
        {didCopy ? t("copied") : t("copyLink")}
      </button>
    </div>
  );
};

const columnHelper = createColumnHelper<Participant & { votes: Vote[] }>();

const VoteSummary = (props: { votes: Vote[] }) => {
  const yes: string[] = [];
  const ifNeedBe: string[] = [];
  const no: string[] = [];

  for (const vote of props.votes) {
    switch (vote.type) {
      case "yes":
        yes.push(vote.optionId);
        break;
      case "ifNeedBe":
        ifNeedBe.push(vote.optionId);
        break;
      case "no":
        no.push(vote.optionId);
        break;
    }
  }
  return (
    <span className="inline-flex gap-3 text-sm font-semibold tabular-nums">
      <span className="flex items-center gap-1.5">
        <VoteIcon type="yes" />
        {yes.length}
      </span>
      <span className="flex items-center gap-1.5">
        <VoteIcon type="ifNeedBe" />
        {ifNeedBe.length}
      </span>
      <span className="flex items-center gap-1.5">
        <VoteIcon type="no" />
        {no.length}
      </span>
    </span>
  );
};

const Heading = (props: { id: string; start: Date; duration: number }) => {
  const score = useScore(props.id);
  return (
    <div className="mx-auto whitespace-nowrap text-center">
      <div className="text-xl font-bold">{dayjs(props.start).format("D")}</div>
      <div className="text-sm uppercase">
        {dayjs(props.start).format("MMM")}
      </div>
      {props.duration > 0 ? (
        <div className="mt-2">{dayjs(props.start).format("LT")}</div>
      ) : null}
      <div className="mt-4">
        <ScoreSummary yesScore={score.yes} orientation="vertical" />
      </div>
    </div>
  );
};

const Responses = () => {
  const { data: responses = [] } = useCurrentPollResponses();
  const { data: options = [] } = useCurrentPollOptions();

  const { t } = useTranslation();
  return (
    <DragScroll className="card relative bg-white">
      <Table
        layout="fixed"
        data={responses}
        columns={[
          columnHelper.accessor("name", {
            header: "Name",
            size: 300,
            cell: (info) => (
              <div className="whitespace-nowrap">
                <div className="flex gap-4">
                  <UserAvatar name={info.getValue()} />
                  <div className="">
                    <div className="font-semibold">{info.getValue()}</div>
                    <div className="text-gray-500">
                      {dayjs(info.row.original.createdAt).format("L")}
                    </div>
                  </div>
                </div>
              </div>
            ),
          }),
          ...options.map((option) => {
            return columnHelper.accessor("votes", {
              header: () => <Heading {...option} />,
              size: 80,
              cell: (info) => (
                <VoteIcon
                  className="mx-auto"
                  type={
                    info.getValue().find((vote) => vote.optionId === option.id)
                      ?.type
                  }
                />
              ),
            });
          }),
          // columnHelper.accessor("votes", {
          //   header: "Votes",
          //   size: 100,
          //   cell: (info) => <VoteSummary votes={info.getValue()} />,
          // }),
          columnHelper.accessor("createdAt", {
            header: () => null,
            maxSize: 100,
            cell: () => (
              <div className="sticky right-0 z-50">
                <Button icon={<DotsHorizontalIcon />} />
              </div>
            ),
          }),
        ]}
      />
    </DragScroll>
  );
};

// const Page: NextPageWithLayout = () => {
//   const { data: responses } = useCurrentPollResponses();
//   return (
//     <div className="">
//       {responses?.length === 0 ? (
//         <div className="bg-graph overflow-auto rounded-md border p-8 lg:p-16">
//           <div className="flex w-full justify-center ">
//             <div className="w-full max-w-md text-center">
//               <InboxIcon className="mb-2 inline-block h-10" />
//               <div className="mb-4 text-xl font-semibold">
//                 <Trans i18nKey="poll.noResponses" defaults="No responses yet" />
//               </div>
//               <CopyLink />
//               <div className="mt-4 text-slate-500">
//                 <Trans
//                   i18nKey="poll.shareLinkInstruction"
//                   defaults="Share this link with your participants to begin collecting responses."
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <div>

//         </div>
//       )}
//     </div>
//   );
// };

const Page: NextPageWithLayout = () => {
  return (
    <div className="space-y-8">
      <MostPopular />
    </div>
  );
};

const MostPopular = () => {
  const createPollLink = useCreatePollLink();
  const { data: responses } = useCurrentPollResponses();
  const { data: options = [] } = useCurrentPollOptions();
  const bestOptions = React.useMemo(() => {
    if (!responses) return [];

    const votes = responses.flatMap((response) => response.votes);

    const scoreByOptionId: Record<
      string,
      {
        yes: number;
        ifNeedBe: number;
        no: number;
      }
    > = {};

    for (const vote of votes) {
      if (!scoreByOptionId[vote.optionId]) {
        scoreByOptionId[vote.optionId] = { yes: 0, ifNeedBe: 0, no: 0 };
      }

      switch (vote.type) {
        case "yes":
          scoreByOptionId[vote.optionId].yes += 1;
          break;
        case "ifNeedBe":
          scoreByOptionId[vote.optionId].ifNeedBe += 1;
          break;
        case "no":
          scoreByOptionId[vote.optionId].no += 1;
          break;
      }
    }

    // Get top 3 options

    return Object.keys(scoreByOptionId)
      .sort((a, b) => scoreByOptionId[b].yes - scoreByOptionId[a].yes)
      .slice(0, 3)
      .flatMap((optionId) => {
        const option = options.find((o) => o.id === optionId);
        if (option) {
          return {
            ...option,
            score: scoreByOptionId[optionId],
          };
        }

        return [];
      });
  }, [responses, options]);

  return (
    <div>
      <div className="grid gap-4">
        <div>
          <h2 className="text-lg tracking-tight">
            <Trans i18nKey="poll.mostPopular" defaults="Most Popular" />
          </h2>
          <p className="text-gray-500">
            <Trans
              i18nKey="poll.bestOptionsDescription"
              defaults="These are the most popular dates with your participants"
            />
          </p>
        </div>
        <div className="divide-y rounded border">
          <div className="bg-graph col-span-2 grid grid-cols-1 lg:grid-cols-3">
            {bestOptions.map((option) => {
              return (
                <div key={option.id} className="">
                  <div className="space-y-4 p-4">
                    <div className="font-bold">
                      {dayjs(option.start).format("LL")}
                    </div>
                    <div>
                      <div className="flex h-2 overflow-hidden rounded-sm bg-gray-300">
                        <div
                          className="h-full bg-green-500"
                          style={{
                            width:
                              (option.score.yes / options.length) * 100 + "%",
                          }}
                        />
                        <div
                          className="h-full bg-amber-400"
                          style={{
                            width:
                              (option.score.ifNeedBe / options.length) * 100 +
                              "%",
                          }}
                        />
                        <div
                          className="h-full "
                          style={{
                            width:
                              (option.score.no / options.length) * 100 + "%",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex p-2.5">
            <Link
              className="btn-default gap-2"
              href={createPollLink("/options")}
            >
              <CalendarIcon className="h-5" />
              <Trans i18nKey="poll.viewResults" defaults="View All Dates" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

Page.getLayout = getAdminLayout;

export const getServerSideProps: GetServerSideProps = withSessionSsr(
  [
    withAuthIfRequired,
    withPageTranslations(),
    async (ctx) => {
      return {
        props: {
          urlId: ctx.query.urlId as string,
        },
      };
    },
  ],
  {
    onPrefetch: async (ssg, ctx) => {
      const pollId = ctx.query.urlId as string;
      await ssg.polls.get.prefetch({
        pollId,
      });
      await ssg.polls.participants.list.prefetch({
        pollId,
      });
      await ssg.polls.options.list.prefetch({
        pollId,
      });
    },
  },
);

export default Page;
