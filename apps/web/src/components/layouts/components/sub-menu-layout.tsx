import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import React from "react";

import { Button } from "@/components/button";
import { Breadcrumbs } from "@/components/layouts/standard-layout/breadcrumbs";

const MenuItem = (props: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
}) => {
  const router = useRouter();
  return (
    <Link
      href={props.href}
      className={clsx("btn-default justify-start gap-2", {
        "text-primary-600 pointer-events-none border border-gray-300 bg-gray-200":
          router.asPath === props.href,
      })}
    >
      <props.icon className="h-5 shrink-0" />
      {props.title}
    </Link>
  );
};

const SubMenuLayout: React.FunctionComponent<{
  children?: React.ReactNode;
  title?: string;
  icon: React.ComponentType<{ className?: string }>;
  header?: React.ReactNode;
  menuItems?: {
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    title: React.ReactNode;
  }[];
}> = ({ children, title, icon, menuItems }) => {
  const { t } = useTranslation();
  return (
    <div className="card overflow-hidden">
      <Breadcrumbs
        title={title}
        icon={icon}
        pageControls={<Button>{t("finalize")}</Button>}
      />
      <div className={clsx("flex gap-2 p-2.5")}>
        {menuItems?.map((item, i) => (
          <MenuItem
            key={i}
            href={item.href}
            icon={item.icon}
            title={item.title}
          />
        ))}
      </div>
      <div>{children}</div>
    </div>
  );
};

export default SubMenuLayout;
