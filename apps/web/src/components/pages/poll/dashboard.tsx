import { MostPopularDates } from "@/components/pages/poll/dashboard/most-popular-dates";
import { RecentlyVoted } from "@/components/pages/poll/dashboard/recently-voted";
import { useCurrentPollResponses } from "@/contexts/current-event";

export const Dashboard = () => {
  const { data: responses = [] } = useCurrentPollResponses();
  return (
    <div className="space-y-4">
      <MostPopularDates />
      {responses?.length > 0 ? <RecentlyVoted /> : null}
    </div>
  );
};
