import { EventDetails } from "@/components/pages/poll/dashboard/event-details";
import { MostPopularDates } from "@/components/pages/poll/dashboard/most-popular-dates";
import { ParticipantLink } from "@/components/pages/poll/dashboard/participant-link";
import { RecentlyVoted } from "@/components/pages/poll/dashboard/recently-voted";
import { PollHeader } from "@/components/pages/poll/header";
import { useCurrentPollResponses } from "@/contexts/current-event";

export const Dashboard = () => {
  const { data: responses = [] } = useCurrentPollResponses();
  return (
    <div className="space-y-4">
      <PollHeader />
      {responses.length > 0 ? <MostPopularDates /> : null}
      <ParticipantLink />
      {/* <EventDetails /> */}
    </div>
  );
};
