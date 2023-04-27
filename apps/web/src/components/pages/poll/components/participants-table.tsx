import { Participant, Vote } from "@rallly/database";
import { createColumnHelper } from "@tanstack/react-table";
import dayjs from "dayjs";

import { DragScroll } from "@/components/drag-scroll";
import UserAvatar from "@/components/poll/user-avatar";
import VoteIcon from "@/components/poll/vote-icon";
import { Table } from "@/components/table";
import { Trans } from "@/components/trans";
import { useCurrentPollOptions } from "@/contexts/current-event";

type ParticipantRow = Participant & { votes: Vote[] };

const participantColumnHelper = createColumnHelper<ParticipantRow>();

export const ParticipantsTable = (props: { data: Row[] }) => {
  const { data: options } = useCurrentPollOptions();
  return (
    <DragScroll>
      <Table
        layout="auto"
        data={props.data}
        columns={[
          participantColumnHelper.accessor("name", {
            header: () => <Trans i18nKey="name" defaults="Name" />,
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
            header: () => <Trans i18nKey="poll.response" defaults="Response" />,
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
    </DragScroll>
  );
};
