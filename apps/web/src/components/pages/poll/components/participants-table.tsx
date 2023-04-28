import { Participant, Vote } from "@rallly/database";
import { DotsHorizontalIcon } from "@rallly/icons";
import { createColumnHelper } from "@tanstack/react-table";
import clsx from "clsx";
import dayjs from "dayjs";

import { Button } from "@/components/button";
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
            header: () => (
              <Trans
                i18nKey="poll.participantAvailability"
                defaults="Availability"
              />
            ),
            cell: (info) => {
              return (
                <div className="flex h-7 items-center gap-1">
                  {options.map((option) => {
                    const vote = info
                      .getValue()
                      .find((v) => v.optionId === option.id);

                    return (
                      <span
                        key={option.id}
                        className={clsx("h-3 w-2 rounded-sm", {
                          "bg-green-500": vote?.type === "yes",
                          "bg-amber-400": vote?.type === "ifNeedBe",
                          "bg-gray-300": vote?.type === "no",
                        })}
                      />
                    );
                  })}
                </div>
              );
            },
          }),
          participantColumnHelper.accessor("createdAt", {
            header: () => <Trans i18nKey="poll.votedOnDate" defaults="Date" />,
            cell: (info) => {
              return (
                <span className="flex items-center gap-2 whitespace-nowrap text-gray-500">
                  {dayjs(info.getValue()).fromNow()}
                </span>
              );
            },
          }),
          participantColumnHelper.display({
            id: "action",
            cell: (info) => (
              <div className="text-right">
                <Button icon={<DotsHorizontalIcon />} />
              </div>
            ),
          }),
        ]}
      />
    </DragScroll>
  );
};
