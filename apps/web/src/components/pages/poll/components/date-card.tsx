import clsx from "clsx";
import dayjs from "dayjs";

export const DateCardInner = (props: {
  dow?: React.ReactNode;
  day?: React.ReactNode;
  month?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={clsx(
        "w-14 overflow-hidden rounded-md border bg-white text-center text-slate-800 shadow-sm",
        props.className,
      )}
    >
      <div className="h-4 border-b border-slate-200 bg-slate-50 text-xs leading-4">
        {props.dow}
      </div>
      <div className="flex h-10 items-center justify-center">
        <div>
          <div className="my-px text-lg font-bold leading-none">
            {props.day}
          </div>
          <div className="text-xs font-bold uppercase">{props.month}</div>
        </div>
      </div>
    </div>
  );
};

export const DateCard = (props: { date?: Date; className?: string }) => {
  if (!props.date) {
    return <DateCardInner className={props.className} />;
  }
  return (
    <DateCardInner
      className={props.className}
      dow={dayjs(props.date).format("ddd")}
      day={dayjs(props.date).format("DD")}
      month={dayjs(props.date).format("MMM")}
    />
  );
};
