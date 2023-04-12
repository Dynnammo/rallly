import { CogIcon, UserIcon } from "@rallly/icons";
import { useTranslation } from "next-i18next";
import React from "react";

import SubMenuLayout from "@/components/layouts/components/sub-menu-layout";
import { Breadcrumbs } from "@/components/layouts/standard-layout/breadcrumbs";
import StandardLayout from "@/components/layouts/v3-layout";

import { NextPageWithLayout } from "../../types";
import { useUser } from "../user-provider";

const ProfileLayout: React.FunctionComponent<{
  children?: React.ReactNode;
}> = ({ children }) => {
  const { t } = useTranslation("app");
  const { user } = useUser();
  return (
    <SubMenuLayout
      menuItems={[
        {
          href: "/profile",
          title: t("profile"),
          icon: UserIcon,
        },
        {
          href: "/preferences",
          title: t("preferences"),
          icon: CogIcon,
        },
      ]}
      title={t("settings")}
      icon={CogIcon}
    >
      <div className="flex items-center gap-4 border-b bg-gray-100 p-4">
        <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-gray-400/50 bg-gray-300/50 shadow-sm">
          <UserIcon className="h-6 text-gray-800" />
        </div>
        <div>
          <div className="flex items-center gap-4">
            <div
              data-testid="user-name"
              className="mb-0 text-lg font-semibold leading-tight"
            >
              {user.isGuest ? t("guest") : user.name}
            </div>
          </div>
          <div className="text-sm text-slate-500">
            {user.isGuest
              ? user.id
              : t("registeredOn", { data: user.createdAt })}
          </div>
        </div>
      </div>
      <div className="bg-white">
        <div className="mx-auto max-w-lg py-8">{children}</div>
      </div>
    </SubMenuLayout>
  );
};

export default ProfileLayout;

export const getProfileLayout: NextPageWithLayout["getLayout"] =
  function getLayout(page) {
    return (
      <StandardLayout>
        <ProfileLayout>{page}</ProfileLayout>
      </StandardLayout>
    );
  };
