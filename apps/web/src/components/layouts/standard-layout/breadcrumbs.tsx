import clsx from "clsx";

export function Breadcrumbs(props: {
  title?: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  showBackButton?: boolean;
  pageControls?: React.ReactNode;
}) {
  const { icon: Icon } = props;
  return (
    <div className={clsx("sticky top-0 z-30 rounded-t", "p-2.5")}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex h-7 min-w-0 items-center gap-2.5 px-1">
          {Icon ? (
            <div>
              <Icon className="text-primary-600 h-6" />
            </div>
          ) : null}
          {typeof props.title === "string" ? (
            <h1 className="items-center gap-4 truncate text-base">
              {props.title}
            </h1>
          ) : (
            props.title
          )}
        </div>
        {props.pageControls ? (
          <div className="justify-end sm:flex">{props.pageControls}</div>
        ) : null}
      </div>
    </div>
  );
}
