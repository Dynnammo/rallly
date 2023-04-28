import { InboxIcon } from "@rallly/icons";

import { MostPopularDates } from "@/components/pages/poll/dashboard/most-popular-dates";
import { ParticipantLink } from "@/components/pages/poll/dashboard/participant-link";
import { RecentlyVoted } from "@/components/pages/poll/dashboard/recently-voted";
import {
  useCurrentEvent,
  useCurrentPollResponses,
} from "@/contexts/current-event";

export const Dashboard = () => {
  const { data: responses = [] } = useCurrentPollResponses();
  const { data: poll } = useCurrentEvent();
  return (
    <div className="space-y-4">
      <ParticipantLink />
      <MostPopularDates />
      <RecentlyVoted />
    </div>
  );
};
