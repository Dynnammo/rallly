import { CalendarIcon, CogIcon } from "@rallly/icons";

import { ButtonLink } from "@/components/pages/poll/components/button-link";
import { Section } from "@/components/pages/poll/components/section";
import { Trans } from "@/components/trans";
import { FormField } from "@/components/ui/form-field";
import { TextSummary } from "@/components/ui/text-summary";
import { useCreatePollLink, useCurrentEvent } from "@/contexts/current-event";

export const EventDetails = () => {
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
      <div className="p-2.5">
        <div className="rounded border bg-white p-3 shadow-sm">
          <div className="max-w-lg space-y-3">
            <FormField label={<Trans i18nKey="title" />}>
              <h3>{poll.title}</h3>
            </FormField>
            <FormField label={<Trans i18nKey="description" />}>
              <TextSummary text={poll.description ?? ""} max={120} />
            </FormField>
            <FormField label={<Trans i18nKey="location" />}>
              <p>{poll.location}</p>
            </FormField>
          </div>
        </div>
      </div>
    </Section>
  );
};
