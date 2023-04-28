import { UsersIcon } from "@rallly/icons";

import { ButtonLink } from "@/components/pages/poll/components/button-link";
import { ParticipantsTable } from "@/components/pages/poll/components/participants-table";
import { Section } from "@/components/pages/poll/components/section";
import { Trans } from "@/components/trans";
import {
  useCreatePollLink,
  useCurrentPollResponses,
} from "@/contexts/current-event";

export const RecentlyVoted = () => {
  const { data: responses = [] } = useCurrentPollResponses();
  const createPollLink = useCreatePollLink();
  return (
    <Section
      border={true}
      icon={UsersIcon}
      title={
        <Trans i18nKey="poll.recentlyVoted" defaults="Recent Participants" />
      }
      subtitle={
        <Trans
          i18nKey="poll.recentlyVotedSubtitle"
          defaults="These participants have responded to your poll"
        />
      }
      actions={
        <ButtonLink
          href={createPollLink("participants")}
          className="w-full"
          icon={UsersIcon}
        >
          <Trans
            i18nKey="poll.viewAllParticipants"
            values={{ count: responses?.length ?? 0 }}
            defaults="View {count, plural, one {# participant} other {# participants}}"
          />
        </ButtonLink>
      }
    >
      <ParticipantsTable data={responses?.slice(0, 5)} />
    </Section>
  );
};
