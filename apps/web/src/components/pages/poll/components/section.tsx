import { IconComponent } from "@/types";

type SectionProps = {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  icon?: IconComponent;
};

export const Section = ({
  children,
  title,
  subtitle,
  actions,
  icon: Icon,
}: React.PropsWithChildren<SectionProps>) => (
  <section className="space-y-4 overflow-hidden">
    <div className="">
      <div className="flex gap-1.5">
        {Icon ? (
          <div className="-ml-1 p-1">
            <Icon className="h-5" />
          </div>
        ) : null}
        <div>
          <h2 className="mb-1 text-lg tracking-tight">{title}</h2>
        </div>
      </div>
      <p className="hidden leading-tight text-gray-500 sm:block">{subtitle}</p>
    </div>
    <div>{children}</div>
    {actions ? <div className="">{actions}</div> : null}
  </section>
);
