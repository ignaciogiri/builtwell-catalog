import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/**
 * A labelled form control.
 *
 * The control is passed as children and associated by htmlFor/id, so the id is
 * derived from the field name rather than left to each caller to remember.
 */
export function Field({
  children,
  className,
  hint,
  htmlFor,
  label,
}: {
  children: React.ReactNode;
  className?: string;
  hint?: string;
  htmlFor: string;
  label: string;
}) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint ? (
        <p className="text-muted-foreground text-xs">{hint}</p>
      ) : null}
    </div>
  );
}
