import { Participant, Vote } from "@rallly/database";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import clsx from "clsx";
import { useTranslation } from "next-i18next";
import React from "react";

import { Button } from "@/components/button";
import {
  useCurrentPollOptions,
  useCurrentPollResponses,
  useScore,
} from "@/contexts/current-event";

import { useDayjs } from "../utils/dayjs";
import { useParticipants } from "./participants-provider";
import { ScoreSummary } from "./poll/score-summary";
import UserAvatar from "./poll/participant-avatar";
import VoteIcon from "./poll/vote-icon";
import { usePoll } from "./poll-context";
import Tooltip from "./tooltip";

const TempOption = (props: { optionId: string }) => {
  const { t } = useTranslation();
  const { dayjs } = useDayjs();
  const { data: participants = [] } = useCurrentPollResponses();
  const { data: options = [] } = useCurrentPollOptions();

  const option = options.find((o) => o.id === props.optionId);
  const score = useScore(option?.id ?? "");

  const highScore = options.length; // TODO (Luke Vella) [2023-04-19]: Fix this

  if (!option) {
    return null;
  }

  const isRange = option.duration > 0;
  const start = dayjs(option.start);
  const end = isRange ? start.add(option.duration, "minutes") : null;

  return (
    <div
      role="button"
      className="group relative z-10 min-w-[70px] rounded border border-gray-200 p-3 hover:border-gray-300 active:bg-gray-200"
    >
      <div className="absolute inset-0 -z-10">
        <div
          className={clsx(
            score.yes === participants.length ? "rounded" : "rounded-b",
            "group-hover:bg-primary-100/50 group-hover:ring-primary-200 absolute bottom-0 w-full bg-gray-50 ring-1 ring-gray-200",
          )}
          style={{
            height: (score.yes / participants.length) * 100 + "%",
          }}
        />
      </div>

      <div className="relative z-10 space-y-3">
        <div>
          <div className="text-xl font-bold">{start.format("D")}</div>
          <div className="text-xs font-semibold uppercase">
            {start.format("MMM")}
          </div>
        </div>
        <div className="inline-block">
          <ScoreSummary
            orientation="vertical"
            yesScore={score.yes}
            highlight={highScore === score.yes}
          />
        </div>
      </div>
    </div>
  );
};

type Row = Participant & { votes: Vote[] };
const columnHelper = createColumnHelper<Row>();

export const TableView = (props: { className?: string }) => {
  const { data: participants = [] } = useCurrentPollResponses();
  const { data: options = [] } = useCurrentPollOptions();

  const [pageSize] = React.useState(10);
  const columnPageSize = 30;
  const [columnPageIndex] = React.useState(0);
  const { dayjs } = useDayjs();
  const dateColumns = React.useMemo(() => {
    return options.slice(columnPageIndex, columnPageSize).map((option, index) =>
      columnHelper.accessor((participant) => participant.votes[index], {
        header: () => <TempOption optionId={option.id} />,
        id: option.id,
        size: 100,
        cell: (cell) => {
          const vote = cell.row.original.votes.find(
            (v) => v.optionId === cell.column.id,
          );
          return (
            <div className="">
              <div className="mx-auto flex h-6 w-6 items-center justify-center rounded-full border border-gray-100 bg-white">
                <Tooltip
                  content={
                    <div className="flex gap-2">
                      <UserAvatar
                        name={cell.row.original.name}
                        showName={true}
                      />
                      <div className="flex items-center gap-1">
                        <div className="shrink-0">
                          <VoteIcon type={vote?.type} />
                        </div>
                        <div className="opacity-">
                          {(() => {
                            const option = options.find(
                              (option) => option.id === cell.column.id,
                            );

                            if (!option) {
                              return null;
                            }
                            return dayjs(option.start).format("LL");
                          })()}
                        </div>
                      </div>
                    </div>
                  }
                >
                  <VoteIcon type={vote?.type} />
                </Tooltip>
              </div>
            </div>
          );
        },
      }),
    );
  }, [options, columnPageIndex, dayjs]);

  const table = useReactTable({
    data: participants,
    initialState: { pagination: { pageSize } },
    columns: [
      columnHelper.accessor("name", {
        id: "name",
        header: () => null,
        size: 140,
        cell: (cell) => (
          <Button className="h-10 w-full justify-start">
            <UserAvatar name={cell.getValue()} showName={true} />
          </Button>
        ),
      }),
      ...dateColumns,
    ],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
  return (
    <div className={clsx("select-none", props.className)}>
      <table cellPadding={0} className="table-auto">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  style={{
                    width: header.getSize(),
                  }}
                  key={header.id}
                  className={clsx("p-1 font-normal")}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getAllCells().map((cell) => (
                <td
                  style={{ width: cell.column.getSize() }}
                  key={cell.id}
                  className={clsx("p-1")}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
