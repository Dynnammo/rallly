import clsx from "clsx";
import Link from "next/link";

export const ButtonLink = (
  props: React.PropsWithChildren<{
    href: string;
    icon?: React.ComponentType<{ className?: string }>;
    className?: string;
  }>,
) => {
  return (
    <Link {...props} className={clsx("btn-default gap-2", props.className)}>
      {props.icon ? <props.icon className="h-5" /> : null}
      <span>{props.children}</span>
    </Link>
  );
};
