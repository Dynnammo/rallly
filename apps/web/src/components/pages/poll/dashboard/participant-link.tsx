import {
  ChevronDoubleDownIcon,
  ClipboardCopyIcon,
  InboxIcon,
  ShareIcon,
  UsersIcon,
} from "@rallly/icons";
import clsx from "clsx";
import React from "react";
import toast from "react-hot-toast";
import { useCopyToClipboard } from "react-use";

import { Button } from "@/components/button";
import { ParticipantsTable } from "@/components/pages/poll/components/participants-table";
import { Section } from "@/components/pages/poll/components/section";
import Tooltip from "@/components/tooltip";
import { Trans } from "@/components/trans";
import {
  useCurrentEvent,
  useCurrentPollResponses,
} from "@/contexts/current-event";

const CopyLink = () => {
  const { data: poll } = useCurrentEvent();

  const participantUrl = `${window.location.origin}/p/${poll?.participantUrlId}`;
  const [didCopy, setDidCopy] = React.useState(false);

  const [state, copyToClipboard] = useCopyToClipboard();

  React.useEffect(() => {
    if (state.error) {
      toast.error(`Unable to copy value: ${state.error.message}`);
    }
  }, [state]);

  return (
    <Button
      className={clsx(
        "w-full overflow-hidden px-2 font-normal tracking-tight ",
        didCopy
          ? "ring-primary-600 text-primary-600 bg-primary-100 ring-offset-primary-100 hover:bg-primary-100 ring-2 ring-offset-1"
          : "border-slate-300 bg-gray-100",
      )}
      onClick={() => {
        copyToClipboard(participantUrl);
        setDidCopy(true);
        setTimeout(() => {
          setDidCopy(false);
        }, 1000);
      }}
    >
      <div className="flex w-full justify-between">
        <div className="flex min-w-0 items-center gap-2">
          <div className="text-sm">Invite Link:</div>
          <div className="truncate">{participantUrl}</div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {didCopy ? <div>Copied</div> : null}
          <div className="shrink-0">
            <ClipboardCopyIcon className={clsx("ml-2 h-5 ")} />
          </div>
        </div>
      </div>
    </Button>
  );
};

export const ParticipantLink = () => {
  const { data: poll } = useCurrentEvent();
  const { data: responses = [] } = useCurrentPollResponses();
  if (!poll) {
    return null;
  }
  return (
    <Section icon={UsersIcon} title={<Trans defaults="Participants" />}>
      {responses.length > 0 ? (
        <ParticipantsTable data={responses} />
      ) : (
        <div className="mx-auto max-w-xl  space-y-4 p-16 text-center tracking-tight">
          <div>
            <InboxIcon className="text-primary-600 inline-block h-12" />
          </div>
          <div className="text-lg font-bold">No responses yet</div>
          <div>
            Copy your invite link and share it with your participants to start
            getting responses.
          </div>
          <CopyLink />
        </div>
      )}
    </Section>
  );
};
