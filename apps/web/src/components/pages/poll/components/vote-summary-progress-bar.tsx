export const VoteSummaryProgressBar = (props: {
  total: number;
  yes: string[];
  ifNeedBe: string[];
  no: string[];
}) => {
  return (
    <div className="flex h-2 grow overflow-hidden rounded  bg-slate-100">
      <div
        className="h-full bg-green-500"
        style={{
          width: (props.yes.length / props.total) * 100 + "%",
        }}
      />
      <div
        className="h-full bg-amber-400"
        style={{
          width: (props.ifNeedBe.length / props.total) * 100 + "%",
        }}
      />
      <div
        className="h-full bg-slate-300"
        style={{
          width: (props.no.length / props.total) * 100 + "%",
        }}
      />
    </div>
  );
};
