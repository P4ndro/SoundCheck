export interface MetaItemProps {
  label: string;
  value: string;
  mono?: boolean;
}

export function MetaItem({ label, value, mono }: MetaItemProps) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-subtle">{label}</span>
      <span
        className={
          mono
            ? "font-mono font-medium text-foreground"
            : "font-medium text-foreground"
        }
      >
        {value}
      </span>
    </div>
  );
}
