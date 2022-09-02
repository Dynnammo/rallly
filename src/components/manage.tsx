import clsx from "clsx";
import { useTranslation } from "next-i18next";
import React from "react";

import { AppLayout, AppLayoutHeading } from "./app-layout";
import { Advanced } from "./manage/advanced";
import { General } from "./manage/general";
import { Options } from "./manage/options";
import { usePoll } from "./poll-provider";

const Section: React.VoidFunctionComponent<{
  className?: string;
  children?: React.ReactNode;
  title: string;
}> = ({ title, className, children }) => {
  return (
    <div className={clsx("py-4", className)}>
      <h2>{title}</h2>
      {children}
    </div>
  );
};

export const Manage: React.VFC = () => {
  const { t } = useTranslation("app");
  const { poll } = usePoll();
  return (
    <AppLayout
      title={t("manage")}
      breadcrumbs={[
        {
          href: "/polls",
          title: t("meetingPolls"),
        },
        {
          href: `/admin/${poll.adminUrlId}`,
          title: poll.title,
        },
      ]}
    >
      <div className="rounded-md border bg-white/50 p-6">
        <AppLayoutHeading
          title={t("manage")}
          description={t("manageDescription")}
        />
        <div className="">
          <Section title={t("details")}>
            <General />
          </Section>
          <Section title={t("options")}>
            <Options />
          </Section>
          <Section title={t("advanced")}>
            <Advanced />
          </Section>
        </div>
      </div>
    </AppLayout>
  );
};
