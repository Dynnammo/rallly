import { withAuthIfRequired, withSessionSsr } from "@rallly/backend/next";
import { Participant, Vote } from "@rallly/database";
import {
  CalendarIcon,
  ClipboardCopyIcon,
  QuestionMarkCircleIcon,
  ShareIcon,
  StarIcon,
  UserIcon,
  UsersIcon,
} from "@rallly/icons";
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
import { getAdminLayout } from "@/components/layouts/admin-layout";
import { ScoreSummary } from "@/components/poll/score-summary";
import UserAvatar from "@/components/poll/user-avatar";
import VoteIcon from "@/components/poll/vote-icon";
import { Table } from "@/components/table";
import { Trans } from "@/components/trans";
import { ParticipantAvatarBar } from "@/components/ui/participant-avatar-bar";
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

const VoteSummary = (props: {
  total: number;
  yes: string[];
  ifNeedBe: string[];
  no: string[];
}) => {
  const pending =
    props.total - props.yes.length - props.ifNeedBe.length - props.no.length;
  return (
    <span className="inline-flex gap-3 text-sm font-semibold tabular-nums">
      <span className="flex items-center gap-1.5">
        <UserIcon className="h-5" />
        <span>
          {props.yes.length + props.ifNeedBe.length}
          <span className="text-gray-400">{`/${props.total}`}</span>
        </span>
      </span>
      {props.ifNeedBe.length ? (
        <span className="flex items-center gap-1.5">
          <VoteIcon type="ifNeedBe" />
          {props.ifNeedBe.length}
        </span>
      ) : null}
      {pending ? (
        <span className="flex items-center gap-1.5">
          <QuestionMarkCircleIcon className="h-4" />
          {pending}
        </span>
      ) : null}
    </span>
  );
};

// const Responses = () => {
//   const { data: responses = [] } = useCurrentPollResponses();
//   const { data: options = [] } = useCurrentPollOptions();

//   const { t } = useTranslation();
//   return (
//     <DragScroll className="card relative bg-white">
//       <Table
//         layout="fixed"
//         data={responses}
//         columns={[
//           columnHelper.accessor("name", {
//             header: "Name",
//             size: 300,
//             cell: (info) => (
//               <div className="whitespace-nowrap">
//                 <div className="flex gap-4">
//                   <UserAvatar name={info.getValue()} />
//                   <div className="">
//                     <div className="font-semibold">{info.getValue()}</div>
//                     <div className="text-gray-500">
//                       {dayjs(info.row.original.createdAt).format("L")}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ),
//           }),
//           ...options.map((option) => {
//             return columnHelper.accessor("votes", {
//               header: () => <Heading {...option} />,
//               size: 80,
//               cell: (info) => (
//                 <VoteIcon
//                   className="mx-auto"
//                   type={
//                     info.getValue().find((vote) => vote.optionId === option.id)
//                       ?.type
//                   }
//                 />
//               ),
//             });
//           }),
//           // columnHelper.accessor("votes", {
//           //   header: "Votes",
//           //   size: 100,
//           //   cell: (info) => <VoteSummary votes={info.getValue()} />,
//           // }),
//           columnHelper.accessor("createdAt", {
//             header: () => null,
//             maxSize: 100,
//             cell: () => (
//               <div className="sticky right-0 z-50">
//                 <Button icon={<DotsHorizontalIcon />} />
//               </div>
//             ),
//           }),
//         ]}
//       />
//     </DragScroll>
//   );
// };

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

type SectionProps = {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
};

const Section = ({
  children,
  title,
  subtitle,
  actions,
}: React.PropsWithChildren<SectionProps>) => (
  <section className="overflow-hidden rounded-md border bg-white">
    <div className="flex justify-between border-b px-4 py-3">
      <div>
        <h2 className="text-lg tracking-tight">{title}</h2>
        <p className="text-gray-500">{subtitle}</p>
      </div>
    </div>
    <div>{children}</div>
    {actions ? <div className="border-t bg-gray-50 p-3">{actions}</div> : null}
  </section>
);

const Card = (
  props: React.PropsWithChildren<{
    className?: string;
    footer?: React.ReactNode;
  }>,
) => {
  return <div className={clsx(props.className)}>{props.children}</div>;
};

const ButtonLink = (
  props: React.PropsWithChildren<{
    href: string;
    icon?: React.ComponentType<{ className?: string }>;
    className?: string;
  }>,
) => {
  return (
    <Link {...props} className={clsx("btn-default gap-2", props.className)}>
      {props.icon ? <props.icon className="h-5" /> : null}
      <span>{props.children}</span>
    </Link>
  );
};

const participantColumnHelper = createColumnHelper<
  Participant & { votes: Vote[] }
>();

const RecentlyVoted = () => {
  const { data: responses } = useCurrentPollResponses();
  const { data: options } = useCurrentPollOptions();
  const createPollLink = useCreatePollLink();
  return (
    <Section
      title={<Trans i18nKey="poll.recentlyVoted" defaults="Recently Voted" />}
      subtitle={
        <Trans
          i18nKey="poll.recentlyVotedSubtitle"
          defaults="These participants have voted."
        />
      }
      actions={
        <ButtonLink href={createPollLink("participants")} icon={UsersIcon}>
          <Trans
            i18nKey="poll.viewAllParticipants"
            values={{ count: responses?.length ?? 0 }}
            defaults="View {count, plural, one {# participant} other {# participants}}"
          />
        </ButtonLink>
      }
    >
      <Card>
        <Table
          layout="auto"
          data={responses?.slice(0, 5) ?? []}
          columns={[
            participantColumnHelper.accessor("name", {
              header: () => (
                <Trans
                  i18nKey="poll.participantName"
                  defaults="Participant Name"
                />
              ),
              cell: (info) => {
                return (
                  <div>
                    <UserAvatar
                      seed={info.row.original.id}
                      name={info.getValue()}
                      showName={true}
                    />
                  </div>
                );
              },
            }),
            participantColumnHelper.accessor("votes", {
              header: () => <Trans i18nKey="poll.votes" defaults="Votes" />,
              cell: (info) => {
                return (
                  <div className="flex h-7 items-center gap-2">
                    {options?.slice(0, 8).map((option) => {
                      const vote = info
                        .getValue()
                        .find((v) => v.optionId === option.id);

                      return <VoteIcon type={vote?.type} key={option.id} />;
                    })}
                  </div>
                );
              },
            }),
            participantColumnHelper.accessor("createdAt", {
              header: () => (
                <Trans i18nKey="poll.votedOnDate" defaults="Date" />
              ),
              cell: (info) => {
                return (
                  <span className="flex items-center gap-2 text-sm text-gray-500">
                    {dayjs(info.getValue()).fromNow()}
                  </span>
                );
              },
            }),
          ]}
        />
      </Card>
    </Section>
  );
};

const VoteSummaryProgressBar = (props: {
  total: number;
  yes: string[];
  ifNeedBe: string[];
  no: string[];
}) => {
  return (
    <div className="flex h-2 overflow-hidden rounded  bg-slate-100">
      <div
        className="h-full bg-green-500"
        style={{
          width: (props.yes.length / props.total) * 100 + "%",
        }}
      />
      <div
        className="h-full bg-amber-400"
        style={{
          width: (props.ifNeedBe.length / props.total) * 100 + "%",
        }}
      />
      <div
        className="h-full bg-slate-300"
        style={{
          width: (props.no.length / props.total) * 100 + "%",
        }}
      />
    </div>
  );
};

const MostPopular = () => {
  const createPollLink = useCreatePollLink();
  const { data: responses = [] } = useCurrentPollResponses();
  const { data: options = [] } = useCurrentPollOptions();
  const scoreByOptionId = React.useMemo(() => {
    const res = options.reduce<
      Record<
        string,
        {
          yes: string[];
          ifNeedBe: string[];
          no: string[];
        }
      >
    >((acc, option) => {
      acc[option.id] = { yes: [], ifNeedBe: [], no: [] };
      return acc;
    }, {});

    const votes = responses.flatMap((response) => response.votes);

    for (const vote of votes) {
      if (!res[vote.optionId]) {
        res[vote.optionId] = { yes: [], ifNeedBe: [], no: [] };
      }

      switch (vote.type) {
        case "yes":
          res[vote.optionId].yes.push(vote.participantId);
          break;
        case "ifNeedBe":
          res[vote.optionId].ifNeedBe.push(vote.participantId);
          break;
        case "no":
          res[vote.optionId].no.push(vote.participantId);
          break;
      }
    }
    return res;
  }, [responses, options]);

  const bestOptions = React.useMemo(() => {
    // Get top 3 options

    return Object.keys(scoreByOptionId)
      .sort((a, b) => {
        const yesScore =
          scoreByOptionId[b].yes.length - scoreByOptionId[a].yes.length;

        if (yesScore === 0) {
          // if have same amount of yes votes, check ifNeedBe
          return (
            scoreByOptionId[b].ifNeedBe.length -
            scoreByOptionId[a].ifNeedBe.length
          );
        }

        return yesScore;
      })
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
  }, [scoreByOptionId, options]);

  return (
    <Section
      title={<Trans i18nKey="poll.mostPopular" defaults="Most Popular" />}
      subtitle={
        <Trans
          i18nKey="poll.bestOptionsDescription"
          defaults="These are the most popular dates with your participants."
        />
      }
      actions={
        <ButtonLink href={createPollLink("participants")} icon={CalendarIcon}>
          <Trans
            i18nKey="poll.viewAllDates"
            values={{ count: options.length }}
            defaults="View {count, plural, one {# Date} other {# Dates}}"
          />
        </ButtonLink>
      }
    >
      <Card>
        <div className="bg-graph flex gap-3 p-3">
          {bestOptions.map((option) => {
            return (
              <div
                key={option.id}
                className="grow rounded border bg-white md:basis-1/3"
              >
                <div className="flex items-start gap-4 border-b p-4">
                  <div className="w-16 overflow-hidden rounded-md border border-slate-200 bg-white text-center text-slate-800">
                    <div className="border-b  border-slate-200 bg-slate-50 pt-0.5 text-xs leading-4">
                      {dayjs(option.start).format("ddd")}
                    </div>
                    <div className="py-1">
                      <div className="text-lg font-bold leading-tight">
                        {dayjs(option.start).format("DD")}
                      </div>
                      <div className="text-xs font-bold uppercase">
                        {dayjs(option.start).format("MMM")}
                      </div>
                    </div>
                  </div>
                  <div>
                    <ul>
                      {option.duration ? (
                        <li>
                          <Trans
                            i18nKey="poll.startTime"
                            values={{
                              startTime: dayjs(option.start).format("LT"),
                            }}
                            components={{ b: <strong /> }}
                            defaults="<b>Start:</b> {startTime}"
                          />
                        </li>
                      ) : null}
                      <li>
                        <Trans
                          i18nKey="poll.optionDuration"
                          values={{
                            duration:
                              option.duration === 0
                                ? "All Day"
                                : dayjs
                                    .duration(option.duration, "minutes")
                                    .humanize(),
                          }}
                          components={{ b: <strong /> }}
                          defaults="<b>Duration:</b> {duration}"
                        />
                      </li>

                      <li className="mt-2">
                        <ParticipantAvatarBar
                          participants={responses.filter((response) => {
                            return scoreByOptionId[option.id].yes.includes(
                              response.id,
                            );
                          })}
                          max={5}
                        />
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3">
                  <div className="grow">
                    <VoteSummaryProgressBar
                      total={responses?.length || 0}
                      {...option.score}
                    />
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <VoteSummary
                      {...scoreByOptionId[option.id]}
                      total={responses?.length || 0}
                    />
                  </div>
                  <div>
                    <Button icon={<StarIcon />}>
                      <Trans i18nKey="poll.book" defaults="Book" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </Section>
  );
};

const ParticipantLink = () => {
  const { data: event } = useCurrentEvent();
  return (
    <div className="flex items-center justify-end gap-2 rounded-md border bg-white p-4 py-2.5 shadow-sm">
      <div className="font-semibold">Share link:</div>
      <div className="flex grow items-center gap-2">
        <Link
          target="_blank"
          className="font-mono tracking-tight"
          href={`${window.location.origin}/p/${event?.participantUrlId}`}
        >{`${window.location.origin}/p/${event?.participantUrlId}`}</Link>
        <div>
          <Button icon={<ClipboardCopyIcon />} />
        </div>
      </div>
    </div>
  );
};

const ShareHint = () => {
  return (
    <div className="flex rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-600 shadow-sm">
      <ShareIcon className="mr-4 h-6" />
      <Trans
        i18nKey="poll.shareHint"
        defaults="Share this link with your participants to start gathering responses"
      />
    </div>
  );
};

const Page: NextPageWithLayout = () => {
  const { data: responses = [] } = useCurrentPollResponses();
  return (
    <div className="space-y-4">
      <ParticipantLink />
      <MostPopular />
      {responses?.length > 0 ? <RecentlyVoted /> : null}
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
