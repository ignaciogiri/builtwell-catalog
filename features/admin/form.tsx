"use client";

import { useActionState, useEffect } from "react";
import { type AdminState, IDLE } from "@/features/admin/state";
import { cn } from "@/lib/utils";

type Action = (state: AdminState, formData: FormData) => Promise<AdminState>;

/**
 * A form wired to a server action, with its result shown underneath.
 *
 * Every editor form takes the same (state, formData) action signature, so this
 * one wrapper covers items, categories and tags. Children are plain elements
 * rather than a render prop — a function cannot cross into a client component
 * — so the pending state is read by SubmitButton through useFormStatus.
 */
export function AdminForm({
  action,
  children,
  className,
  id,
  onSuccess,
}: {
  action: Action;
  children: React.ReactNode;
  className?: string;
  /**
   * Lets controls outside the form join it with a matching `form` attribute —
   * which is how a row of table cells submits as one form, since a <form>
   * element cannot span them.
   */
  id?: string;
  /** Called once per successful save, so a dialog can close behind it. */
  onSuccess?: () => void;
}) {
  const [state, formAction] = useActionState(action, IDLE);

  useEffect(() => {
    if (state.status === "ok") {
      onSuccess?.();
    }
  }, [state, onSuccess]);

  return (
    <form action={formAction} className={className} id={id}>
      {children}

      {state.status === "idle" ? null : (
        <p
          className={cn(
            "mt-2 text-xs",
            state.status === "error"
              ? "text-destructive"
              : "text-muted-foreground"
          )}
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
