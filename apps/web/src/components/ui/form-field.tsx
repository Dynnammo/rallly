export const FormField = ({
  label,
  children,
}: React.PropsWithChildren<{ label?: React.ReactNode }>) => {
  return (
    <div className="flex flex-col gap-1 lg:flex-row">
      <div className="w-32 shrink-0">
        <label>{label}</label>
      </div>
      <div className="grow">{children}</div>
    </div>
  );
};
