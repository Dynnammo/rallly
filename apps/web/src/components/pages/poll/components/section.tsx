import clsx from "clsx";

import { IconComponent } from "@/types";

type SectionProps = {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  border?: boolean;
  className?: string;
  icon?: IconComponent;
};

export const Section = ({
  children,
  title,
  subtitle,
  actions,
  icon: Icon,
  border = true,
  className,
}: React.PropsWithChildren<SectionProps>) => (
  <section
    className={clsx(
      "divide-y",
      border
        ? "rounded-md border border-gray-300/50 bg-white/60 shadow-sm ring-1 ring-inset ring-white/25"
        : "",
      className,
    )}
  >
    <div className="p-3">
      <div className="flex gap-1.5">
        {Icon ? (
          <div className="-ml-1 p-1">
            <Icon className="h-5" />
          </div>
        ) : null}
        <div>
          <h2 className="text-lg tracking-tight">{title}</h2>
        </div>
      </div>
      <p className="text-gray-500">{subtitle}</p>
    </div>
    <div>{children}</div>
    {actions ? <div className="p-2.5">{actions}</div> : null}
  </section>
);
