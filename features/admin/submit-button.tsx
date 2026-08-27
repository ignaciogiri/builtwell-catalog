"use client";

import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

/**
 * The submit button for an AdminForm.
 *
 * Split out because useFormStatus only reports the enclosing form's state from
 * a child component, which is also what keeps AdminForm's children plain.
 */
export function SubmitButton({
  children,
  pendingLabel,
  ...props
}: React.ComponentProps<typeof Button> & { pendingLabel?: string }) {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} type="submit" {...props}>
      {pending ? <Loader2 className="animate-spin" data-icon="inline-start" /> : null}
      {pending ? (pendingLabel ?? children) : children}
    </Button>
  );
}
