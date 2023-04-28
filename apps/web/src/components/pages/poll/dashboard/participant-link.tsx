import {
  CalendarIcon,
  ChartSquareBarIcon,
  ClipboardCopyIcon,
  CogIcon,
  LinkIcon,
  ShareIcon,
} from "@rallly/icons";
import clsx from "clsx";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import React from "react";
import toast from "react-hot-toast";
import { useCopyToClipboard } from "react-use";

import { Button } from "@/components/button";
import { ButtonLink } from "@/components/pages/poll/components/button-link";
import { Section } from "@/components/pages/poll/components/section";
import { Trans } from "@/components/trans";
import { useCreatePollLink, useCurrentEvent } from "@/contexts/current-event";

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
        "bg-gray-200 px-2 font-normal tracking-tighter",
        didCopy
          ? "bg-gray-300 ring-2 ring-gray-300 ring-offset-1 ring-offset-gray-100 hover:bg-gray-300"
          : "",
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

const Field = ({
  label,
  children,
}: React.PropsWithChildren<{ label?: React.ReactNode }>) => {
  return (
    <div className="flex flex-col gap-1">
      <div className="w-32 shrink-0">
        <label>{label}</label>
      </div>
      <div className="grow">{children}</div>
    </div>
  );
};

export const ParticipantLink = () => {
  const { data: poll } = useCurrentEvent();
  const createPollLink = useCreatePollLink();
  if (!poll) {
    return null;
  }
  return (
    <Section
      border={true}
      icon={CalendarIcon}
      actions={
        <div className="flex flex-col justify-between gap-2.5">
          <ButtonLink icon={CogIcon} href={createPollLink("settings")}>
            <Trans defaults="View Settings" />
          </ButtonLink>
        </div>
      }
      title={<Trans defaults="Event Details" i18nKey="meetingPoll" />}
    >
      <div className="bg-white p-3">
        <div className="space-y-4">
          <Field label={<Trans i18nKey="description" />}>
            <p className="line-clamp-2">{poll.description}</p>
          </Field>
          <Field label={<Trans i18nKey="location" />}>
            <p>{poll.location}</p>
          </Field>
        </div>
      </div>
    </Section>
  );
};
