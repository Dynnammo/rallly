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
  <section className="overflow-hidden rounded-md border bg-white shadow-sm">
    <div className="border-b py-3 px-4">
      <div className="flex gap-1.5">
        {Icon ? (
          <div className="p-0.5">
            <Icon className="h-5" />
          </div>
        ) : null}
        <div>
          <h2 className="text-base tracking-tight">{title}</h2>
        </div>
      </div>
      <p className="text-gray-500">{subtitle}</p>
    </div>
    <div>{children}</div>
    {actions ? <div className="border-t bg-gray-50 p-3">{actions}</div> : null}
  </section>
);
