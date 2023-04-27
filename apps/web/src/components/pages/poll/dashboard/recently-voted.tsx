import { Participant, Vote } from "@rallly/database";
import { UsersIcon } from "@rallly/icons";
import { createColumnHelper } from "@tanstack/react-table";
import dayjs from "dayjs";

import { ButtonLink } from "@/components/pages/poll/components/button-link";
import { Section } from "@/components/pages/poll/components/section";
import UserAvatar from "@/components/poll/user-avatar";
import VoteIcon from "@/components/poll/vote-icon";
import { Table } from "@/components/table";
import { Trans } from "@/components/trans";
import {
  useCreatePollLink,
  useCurrentPollOptions,
  useCurrentPollResponses,
} from "@/contexts/current-event";

const participantColumnHelper = createColumnHelper<
  Participant & { votes: Vote[] }
>();

export const RecentlyVoted = () => {
  const { data: responses } = useCurrentPollResponses();
  const { data: options } = useCurrentPollOptions();
  const createPollLink = useCreatePollLink();
  return (
    <Section
      icon={UsersIcon}
      title={
        <Trans i18nKey="poll.recentlyVoted" defaults="Recent Participants" />
      }
      subtitle={
        <Trans
          i18nKey="poll.recentlyVotedSubtitle"
          defaults="These participants have responded to your poll."
        />
      }
      actions={
        <ButtonLink
          href={createPollLink("participants")}
          className="w-full"
          icon={UsersIcon}
        >
          <Trans
            i18nKey="poll.viewAllParticipants"
            values={{ count: responses?.length ?? 0 }}
            defaults="View {count, plural, one {# participant} other {# participants}}"
          />
        </ButtonLink>
      }
    >
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
            header: () => <Trans i18nKey="poll.votedOnDate" defaults="Date" />,
            cell: (info) => {
              return (
                <span className="flex items-center gap-2 whitespace-nowrap text-sm text-gray-500">
                  {dayjs(info.getValue()).fromNow()}
                </span>
              );
            },
          }),
        ]}
      />
    </Section>
  );
};
