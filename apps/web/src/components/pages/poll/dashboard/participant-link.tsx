import { ShareIcon } from "@rallly/icons";
import clsx from "clsx";
import { useTranslation } from "next-i18next";
import React from "react";
import toast from "react-hot-toast";
import { useCopyToClipboard } from "react-use";

import { Section } from "@/components/pages/poll/components/section";
import { Trans } from "@/components/trans";
import { useCurrentEvent } from "@/contexts/current-event";

const CopyLink = () => {
  const { data: poll } = useCurrentEvent();
  const { t } = useTranslation();

  const participantUrl = `${window.location.origin}/p/${poll?.participantUrlId}`;
  const [didCopy, setDidCopy] = React.useState(false);

  const [state, copyToClipboard] = useCopyToClipboard();

  React.useEffect(() => {
    if (state.error) {
      toast.error(`Unable to copy value: ${state.error.message}`);
    }
  }, [state]);

  return (
    <div className="relative">
      <input
        readOnly={true}
        className={clsx(
          "w-full rounded-md border p-2 text-slate-600 transition-colors",
          {
            "bg-slate-50 opacity-75": didCopy,
          },
        )}
        value={participantUrl}
      />
      <button
        disabled={didCopy}
        onClick={() => {
          copyToClipboard(participantUrl);
          setDidCopy(true);
          setTimeout(() => {
            setDidCopy(false);
          }, 1000);
        }}
        className="absolute top-1/2 right-3 -translate-y-1/2 font-semibold text-slate-800"
      >
        {didCopy ? t("copied") : t("copyLink")}
      </button>
    </div>
  );
};

export const ParticipantLink = () => {
  return (
    <div className="rounded-md border-2 border-dashed border-gray-300 py-8 ">
      <div className="mx-auto max-w-md p-8 text-center">
        <ShareIcon className="mb-4 inline-block h-10" />
        <h2 className="mb-1">
          <Trans
            defaults="Share your participant link"
            i18nKey="poll.shareLink"
          />
        </h2>
        <p className="mb-4 text-gray-500">
          <Trans
            defaults="Share the link below with your participants to start collecting responses"
            i18nKey="poll.shareLinkDescription"
          />
        </p>
        <div>
          <CopyLink />
        </div>
      </div>
    </div>
  );
};
