import { MostPopularDates } from "@/components/pages/poll/dashboard/most-popular-dates";
import { ParticipantLink } from "@/components/pages/poll/dashboard/participant-link";
import { RecentlyVoted } from "@/components/pages/poll/dashboard/recently-voted";
import { useCurrentPollResponses } from "@/contexts/current-event";

export const Dashboard = () => {
  const { data: responses = [] } = useCurrentPollResponses();
  if (responses.length === 0) {
    return (
      <div>
        <ParticipantLink />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <MostPopularDates />
      <RecentlyVoted />
    </div>
  );
};
