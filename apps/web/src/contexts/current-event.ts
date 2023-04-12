import { trpc } from "@rallly/backend";
import { createStateContext } from "react-use";

export const [usePollId, PollIdProvider] = createStateContext<string>("");

const useCurrentEventId = () => {
  const [pollId] = usePollId();
  return pollId;
};
export const useCurrentPollResponses = () => {
  const pollId = useCurrentEventId();
  return trpc.polls.participants.list.useQuery({ pollId });
};

export const useCurrentEvent = () => {
  const pollId = useCurrentEventId();
  return trpc.polls.get.useQuery({ pollId });
};

export const useCurrentComments = () => {
  const pollId = useCurrentEventId();
  return trpc.polls.comments.list.useQuery({ pollId });
};

export const useCurrentPollOptions = () => {
  const pollId = useCurrentEventId();
  return trpc.polls.options.list.useQuery({ pollId });
};

const [usePollResults, PollResultsProvider] = createStateContext<{
  highScore: number;
  scoresByOptionId: Record<
    string,
    { yes: number; ifNeedBe: number; no: number; score: number }
  >;
}>({
  highScore: 0,
  scoresByOptionId: {},
});

export const useScore = (optionId: string) => {
  const { data: participants = [] } = useCurrentPollResponses();
  return participants.reduce(
    (acc, participant) => {
      for (const vote of participant.votes) {
        if (vote.optionId === optionId) {
          acc[vote.type]++;
        }
      }
      return acc;
    },
    {
      yes: 0,
      ifNeedBe: 0,
      no: 0,
    },
  );
};

// export const useDateFormatter = () => {
//   const { dayjs } = useDayjs();
//   const { preferredTimeZone } = useUserPreferences();
//   const { data: event } = useCurrentEvent();

//   return React.useCallback(
//     (date: string | number | Date, format: string) => {
//       let d = dayjs(date).utc();
//       if (event?.timeZone) {
//         d = d.tz(event.timeZone, true).tz(preferredTimeZone);
//       }
//       return d.format(format);
//     },
//     [dayjs, event?.timeZone, preferredTimeZone],
//   );
// };
