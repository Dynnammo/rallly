import {
  ChevronDownIcon,
  ChevronRightIcon,
  ClockIcon,
  DotsHorizontalIcon,
} from "@rallly/icons";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getGroupedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import clsx from "clsx";
import dayjs from "dayjs";
import React from "react";
import { Trans } from "react-i18next";

import { Button } from "@/components/button";
import { DateCard } from "@/components/pages/poll/components/date-card";
import { VoteSummary } from "@/components/pages/poll/components/vote-summary";
import { VoteSummaryProgressBar } from "@/components/pages/poll/components/vote-summary-progress-bar";
import { ParticipantAvatarBar } from "@/components/ui/participant-avatar-bar";
import {
  useCurrentPollResponses,
  useScoreByOptionId,
} from "@/contexts/current-event";

type DateOption = {
  id: string;
  start: Date;
  duration: number;
};
const optionColumnHelper = createColumnHelper<DateOption>();

export const DatesTable = (props: {
  data: DateOption[];
  footer?: React.ReactNode;
  enableTableFooter?: boolean;
  layout?: "fixed" | "auto";
  className?: string;
}) => {
  const { data: responses = [] } = useCurrentPollResponses();
  const scoreByOptionId = useScoreByOptionId();

  const table = useReactTable<DateOption>({
    data: props.data,
    columns: [
      optionColumnHelper.accessor(
        (row) =>
          row.duration > 0
            ? dayjs(row.start).format("LL")
            : dayjs(row.start).format("MMMM YYYY"),
        {
          id: "group",
          enableGrouping: true,
          cell: (info) => info.getValue(),
        },
      ),
      optionColumnHelper.accessor("start", {
        header: () => <Trans i18nKey="poll.date" defaults="Date" />,
        size: 90,
        cell: (info) =>
          info.row.original.duration ? (
            <div className="flex items-center gap-2 whitespace-nowrap font-semibold tabular-nums">
              <ClockIcon className="h-5" />
              {dayjs(info.getValue()).format("LT")}
            </div>
          ) : (
            <DateCard date={info.getValue()} />
          ),
      }),
      optionColumnHelper.accessor("duration", {
        id: "duration",
        size: 120,
        header: () => <Trans i18nKey="duration" defaults="Duration" />,
        cell: (info) => (
          <div className="flex items-center gap-2 whitespace-nowrap text-gray-500">
            <ClockIcon className="h-5" />
            {info.getValue() ? (
              dayjs.duration(info.getValue(), "minutes").humanize()
            ) : (
              <Trans i18nKey="allDay" defaults="All-day" />
            )}
          </div>
        ),
      }),
      optionColumnHelper.display({
        id: "popularity",
        header: () => <Trans defaults="Popularity" i18nKey="popularity" />,
        size: 300,
        cell: (info) => {
          return (
            <div className="min-w-[100px]">
              <VoteSummaryProgressBar
                {...scoreByOptionId[info.row.original.id]}
                total={responses?.length}
              />
            </div>
          );
        },
      }),
      optionColumnHelper.display({
        id: "participants",
        size: 100,
        header: () => <Trans defaults="Participants" i18nKey="participants" />,
        cell: (info) => {
          return (
            <ParticipantAvatarBar
              participants={responses.filter((response) => {
                return scoreByOptionId[info.row.original.id].yes.includes(
                  response.id,
                );
              })}
              max={5}
            />
          );
        },
      }),
      optionColumnHelper.display({
        id: "attendance",
        size: 100,
        header: () => null,
        cell: (info) => {
          return (
            <VoteSummary
              {...scoreByOptionId[info.row.original.id]}
              total={responses?.length}
            />
          );
        },
      }),
      optionColumnHelper.display({
        id: "book",
        size: 100,
        header: () => null,
        cell: () => (
          <div className="text-right">
            <Button icon={<DotsHorizontalIcon />}></Button>
          </div>
        ),
      }),
    ],
    getCoreRowModel: getCoreRowModel(),
    // pagination
    initialState: {
      grouping: ["group"],
      columnVisibility: { group: false },
      expanded: true,
    },
    getGroupedRowModel: getGroupedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  return (
    <div className={props.className}>
      <table className={clsx("w-full table-auto border-collapse bg-white")}>
        <tbody>
          {table.getRowModel().rows.map((row, i) => {
            if (row.getIsGrouped()) {
              return (
                <tr key={row.id}>
                  <th
                    className="whitespace-nowrap border-b border-gray-200 bg-gray-50 p-2.5"
                    colSpan={row.getVisibleCells().length}
                  >
                    <button
                      className="flex items-center gap-2"
                      {...{
                        onClick: row.getToggleExpandedHandler(),
                        style: {
                          cursor: row.getCanExpand() ? "pointer" : "normal",
                        },
                      }}
                    >
                      {row.getIsExpanded() ? (
                        <ChevronDownIcon className="h-4" />
                      ) : (
                        <ChevronRightIcon className="h-4" />
                      )}
                      <span className="font-semibold">
                        {row.groupingValue as string}
                      </span>
                      <span className="font-normal text-slate-400">
                        ({row.subRows.length})
                      </span>
                    </button>
                  </th>
                </tr>
              );
            }
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={clsx(
                      "overflow-hidden border-gray-100 px-2.5 py-2.5",
                      {
                        "border-b ": table.getRowModel().rows.length !== i + 1,
                      },
                    )}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
