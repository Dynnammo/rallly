import { MostPopularDates } from "@/components/pages/poll/dashboard/most-popular-dates";
import { ParticipantLink } from "@/components/pages/poll/dashboard/participant-link";
import { RecentlyVoted } from "@/components/pages/poll/dashboard/recently-voted";

export const Dashboard = () => {
  return (
    <div className="space-y-4">
      <ParticipantLink />
      <MostPopularDates />
      <RecentlyVoted />
    </div>
  );
};
