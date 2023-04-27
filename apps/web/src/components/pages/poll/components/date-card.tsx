import dayjs from "dayjs";

export const DateCard = (props: { date: Date }) => {
  return (
    <div className="w-16 overflow-hidden rounded-md border border-slate-200 bg-white text-center text-slate-800">
      <div className="border-b  border-slate-200 bg-slate-50 pt-0.5 text-xs leading-4">
        {dayjs(props.date).format("ddd")}
      </div>
      <div className="py-1">
        <div className="text-lg font-bold leading-tight">
          {dayjs(props.date).format("DD")}
        </div>
        <div className="text-xs font-bold uppercase">
          {dayjs(props.date).format("MMM")}
        </div>
      </div>
    </div>
  );
};
