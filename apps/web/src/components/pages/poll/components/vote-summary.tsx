import { QuestionMarkCircleIcon, UserIcon } from "@rallly/icons";
import clsx from "clsx";

import VoteIcon from "@/components/poll/vote-icon";

export const VoteSummary = (props: {
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
