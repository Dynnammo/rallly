import clsx from "clsx";
import { useTranslation } from "next-i18next";

import {
  AvatarColorContext,
  ColoredAvatar,
} from "@/components/poll/user-avatar";
import Tooltip from "@/components/tooltip";

interface ParticipantAvatarBarProps {
  pollId: string;
  participants: { name: string }[];
  max: number;
}

export const ParticipantAvatarBar = ({
  pollId,
  participants,
  max = Infinity,
}: ParticipantAvatarBarProps) => {
  const { t } = useTranslation("app");
  const hiddenCount = participants.length - max;
  return (
    <AvatarColorContext.Provider value={{ seed: pollId }}>
      <div className="flex items-center">
        {participants
          .slice(0, hiddenCount === 1 ? max + 1 : max)
          .map((participant, index) => (
            <Tooltip key={index} content={participant.name}>
              <ColoredAvatar
                className="-mr-1 select-none ring-2 ring-white"
                name={participant.name}
              />
            </Tooltip>
          ))}
        {hiddenCount > 1 ? (
          <Tooltip
            content={
              <ul>
                {participants.slice(max, 10).map((participant, index) => (
                  <li key={index}>{participant.name}</li>
                ))}
              </ul>
            }
          >
            <div
              className={clsx(
                "-mr-1 select-none ring-2 ring-white",
                "rounded-full bg-slate-200 px-1.5 text-xs font-semibold",
                "inline-flex h-6 min-w-[24px] items-center justify-center",
              )}
            >
              <div>+{hiddenCount}</div>
            </div>
          </Tooltip>
        ) : null}
      </div>
    </AvatarColorContext.Provider>
  );
};
