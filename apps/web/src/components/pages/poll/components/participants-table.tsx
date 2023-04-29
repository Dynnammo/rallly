import { Participant, Vote, VoteType } from "@rallly/database";
import { DotsHorizontalIcon } from "@rallly/icons";
import { createColumnHelper } from "@tanstack/react-table";
import clsx from "clsx";
import dayjs from "dayjs";

import { Button } from "@/components/button";
import { DragScroll } from "@/components/drag-scroll";
import UserAvatar from "@/components/poll/user-avatar";
import { Table } from "@/components/table";
import Tooltip from "@/components/tooltip";
import { Trans } from "@/components/trans";
import { useCurrentPollOptions } from "@/contexts/current-event";
import VoteIcon from "@/components/poll/vote-icon";

type ParticipantRow = Participant & { votes: Vote[] };

const participantColumnHelper = createColumnHelper<ParticipantRow>();

const DateTooltip = (props: {
  date: Date;
  duration: number;
  vote?: VoteType;
}) => {
  return (
    <div className="flex items-center gap-1 py-1">
      <VoteIcon type={props.vote} />
      {dayjs(props.date).format("LL")}
    </div>
  );
};

export const ParticipantsTable = (props: { data: ParticipantRow[] }) => {
  const { data: options = [] } = useCurrentPollOptions();
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
                <div className="flex h-7 items-center">
                  {options.map((option) => {
                    const vote = info
                      .getValue()
                      .find((v) => v.optionId === option.id);

                    return (
                      <Tooltip
                        key={option.id}
                        restMs={0}
                        placement="top"
                        content={
                          <DateTooltip
                            vote={vote?.type}
                            duration={option.duration}
                            date={option.start}
                          />
                        }
                      >
                        <span
                          className={clsx(
                            "m-px h-4 w-2 rounded-sm ring-gray-300 ring-offset-1 hover:ring-2",
                            {
                              "bg-green-500": vote?.type === "yes",
                              "bg-amber-400": vote?.type === "ifNeedBe",
                              "bg-gray-300": vote?.type === "no",
                            },
                          )}
                        />
                      </Tooltip>
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
