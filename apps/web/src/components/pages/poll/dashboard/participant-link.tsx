import { ClipboardCopyIcon, ShareIcon } from "@rallly/icons";
import clsx from "clsx";
import React from "react";
import toast from "react-hot-toast";
import { useCopyToClipboard } from "react-use";

import { Button } from "@/components/button";
import { Section } from "@/components/pages/poll/components/section";
import { Trans } from "@/components/trans";
import { useCurrentEvent } from "@/contexts/current-event";

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
        "w-full px-2 font-normal tracking-tight",
        didCopy
          ? "ring-primary-600 text-primary-600 bg-gray-100 ring-2 ring-offset-1 ring-offset-gray-100 hover:bg-gray-100"
          : "bg-gray-200",
      )}
      onClick={() => {
        copyToClipboard(participantUrl);
        setDidCopy(true);
        setTimeout(() => {
          setDidCopy(false);
        }, 500);
      }}
    >
      <div className="flex w-full justify-between">
        <div className="truncate">{participantUrl}</div>
        <ClipboardCopyIcon className={clsx("ml-2 h-5")} />
      </div>
    </Button>
  );
};

export const ParticipantLink = () => {
  const { data: poll } = useCurrentEvent();
  if (!poll) {
    return null;
  }
  return (
    <Section
      title="Share Link"
      subtitle={
        <Trans defaults="Copy this link and share it with your participants to gather responses" />
      }
      icon={ShareIcon}
      actions={<CopyLink />}
    />
  );
};
