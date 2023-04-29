import { trpc } from "@rallly/backend";
import { withAuthIfRequired, withSessionSsr } from "@rallly/backend/next";
import {
  CalendarIcon,
  ChartSquareBarIcon,
  DownloadIcon,
  ExclamationIcon,
  RefreshIcon,
  SaveIcon,
  TrashIcon,
} from "@rallly/icons";
import { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import { useForm } from "react-hook-form";

import { Button } from "@/components/button";
import { Section } from "@/components/pages/poll/components/section";
import { getAdminLayout } from "@/components/pages/poll/layout";
import { TextInput } from "@/components/text-input";
import { Trans } from "@/components/trans";
import { FormField } from "@/components/ui/form-field";
import { useCurrentEvent } from "@/contexts/current-event";
import { NextPageWithLayout } from "@/types";
import { withPageTranslations } from "@/utils/with-page-translations";

type EventFormData = {
  title: string;
  description: string;
  location: string;
};

const FormButtons = ({
  isDirty,
  reset,
}: {
  isDirty: boolean;
  reset: () => void;
}) => {
  return (
    <div className="flex justify-between">
      <Button
        icon={<RefreshIcon />}
        className={!isDirty ? "invisible" : "visible"}
        onClick={() => reset()}
      >
        <Trans i18nKey="cancel" />
      </Button>
      <Button
        type="primary"
        disabled={!isDirty}
        icon={<SaveIcon />}
        htmlType="submit"
      >
        <Trans i18nKey="save" />
      </Button>
    </div>
  );
};

const EventSettings = () => {
  const { data: event, refetch } = useCurrentEvent();
  const { t } = useTranslation();
  const {
    register,
    reset,
    handleSubmit,
    formState: { isDirty, dirtyFields },
  } = useForm<EventFormData>({
    defaultValues: {
      title: event?.title,
      description: event?.description ?? "",
      location: event?.location ?? "",
    },
  });

  const updatePoll = trpc.polls.update.useMutation({
    onSuccess: () => refetch(),
  });
  if (!event) {
    return null;
  }
  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        const res: Partial<EventFormData> = {};
        Object.keys(dirtyFields).forEach((key) => {
          if (dirtyFields[key]) {
            res[key] = data[key];
          }
        });

        // TODO (Luke Vella) [2023-04-28]: We should update this function so that it takes the
        // poll id rather than the admin url id
        await updatePoll.mutateAsync({ urlId: event.adminUrlId ?? "", ...res });
        reset(data);
      })}
    >
      <Section
        icon={CalendarIcon}
        title={<Trans defaults="Event" />}
        subtitle={
          <Trans defaults="Information about the event you are hosting" />
        }
        actions={<FormButtons isDirty={isDirty} reset={reset} />}
      >
        <div className="space-y-3 bg-white p-3">
          <FormField label={<Trans i18nKey="title" />}>
            <TextInput
              placeholder={t("poll.titlePlaceholder", {
                defaultValue: "The title of your event (e.g. Monthly Meetup)",
              })}
              className="w-full"
              {...register("title")}
            />
          </FormField>
          <FormField label={<Trans i18nKey="description" />}>
            <textarea
              rows={4}
              placeholder={t("poll.descriptionPlaceholder", {
                defaultValue: "What you plan to do at your event",
              })}
              className="input w-full"
              {...register("description")}
            />
          </FormField>
          <FormField label={<Trans i18nKey="location" />}>
            <TextInput
              className="w-full"
              placeholder={t("poll.locationPlaceholder", {
                defaultValue:
                  "Where your event will take place (e.g. Zoom, 123 Fake Street)",
              })}
              {...register("location")}
            />
          </FormField>
        </div>
      </Section>
    </form>
  );
};

const PollSettings = () => {
  return (
    <Section
      icon={ChartSquareBarIcon}
      title={<Trans defaults="Poll Settings" i18nKey="pollSettings.title" />}
    >
      <div className="space-y-2.5 p-2.5">
        <div className="rounded border bg-white p-3 shadow-sm">
          <h3 className="">
            <Trans defaults="Export Results" i18nKey="exportResults.title" />
          </h3>
          <p className="mb-4">
            <Trans
              i18nKey="exportResults.description"
              defaults="Download the results of your poll as a CSV"
            />
          </p>
          <Button icon={<DownloadIcon />} type="primary">
            <Trans i18nKey="exportToCsv" />
          </Button>
        </div>
      </div>
    </Section>
  );
};

const DangerZone = () => {
  return (
    <Section
      icon={ExclamationIcon}
      title={<Trans defaults="Danger Zone" i18nKey="pollSettings.dangerZone" />}
      subtitle={<Trans defaults="Destructive actions that are irreversible" />}
    >
      <div className="space-y-2.5 p-2.5">
        <div className="rounded border bg-white p-3 shadow-sm">
          <h3 className="">Delete </h3>
          <p className="mb-4">
            <Trans defaults="Permanently delete this poll." />
          </p>
          <Button icon={<TrashIcon />} type="danger">
            <Trans defaults="Delete" i18nKey="pollSettings.delete" />
          </Button>
        </div>
      </div>
    </Section>
  );
};

const Page: NextPageWithLayout = () => {
  return (
    <div className="space-y-4">
      <EventSettings />
      <PollSettings />
      <DangerZone />
    </div>
  );
};

Page.getLayout = getAdminLayout;

export const getServerSideProps: GetServerSideProps = withSessionSsr(
  [
    withAuthIfRequired,
    withPageTranslations(),
    async (ctx) => {
      return {
        props: {
          urlId: ctx.query.urlId as string,
        },
      };
    },
  ],
  {
    onPrefetch: async (ssg, ctx) => {
      const pollId = ctx.query.urlId as string;
      await ssg.polls.get.prefetch({
        pollId,
      });
      await ssg.polls.participants.list.prefetch({
        pollId,
      });
      await ssg.polls.options.list.prefetch({
        pollId,
      });
    },
  },
);

export default Page;
