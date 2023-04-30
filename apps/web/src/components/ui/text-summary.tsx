import { Trans } from "@/components/trans";
import React from "react";

export const TextSummary = (props: { text: string; max: number }) => {
  const [isExpanded, setExpanded] = React.useState(false);
  if (props.text.length <= props.max) {
    return <p>{props.text}</p>;
  }
  const summary =
    props.text.substring(0, props.text.lastIndexOf(" ", props.max)) + "…";
  return (
    <p>
      {isExpanded ? <>{props.text}</> : <>{summary}</>}{" "}
      {isExpanded ? (
        <button
          className="font-medium tracking-tight hover:text-slate-800 hover:underline active:text-slate-900"
          onClick={() => setExpanded(false)}
        >
          <Trans defaults="Show less" i18nKey="showLess" />
        </button>
      ) : (
        <button
          className="font-medium tracking-tight hover:text-slate-800 hover:underline active:text-slate-900"
          onClick={() => setExpanded(true)}
        >
          <Trans defaults="Show more" i18nKey="showMore" />
        </button>
      )}
    </p>
  );
};
