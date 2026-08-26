import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BACKDROP_CREDIT } from "@/lib/site";

/**
 * Credit for the backdrop photograph.
 *
 * Sits under the app frame: z-0 puts it in the backdrop's stacking level, and
 * being later in the DOM it paints above the photo but below the z-10 frame.
 */
export function PhotoCredit() {
  return (
    <Button
      className="fixed right-11 bottom-11 z-0 hidden h-auto gap-1.5 rounded-full border-white/15 bg-black/60 py-1 pr-4 pl-1 backdrop-blur-md hover:bg-black/80 hover:text-white lg:inline-flex"
      nativeButton={false}
      // Base UI composes through `render`, not Radix's `asChild`, and needs
      // nativeButton={false} when the rendered element is not a <button>.
      render={<a href={BACKDROP_CREDIT.url} rel="noreferrer" />}
      size="sm"
      variant="outline"
    >
      <Avatar className="size-5">
        <AvatarImage
          alt={BACKDROP_CREDIT.handle}
          src={BACKDROP_CREDIT.avatar}
        />
        <AvatarFallback>IG</AvatarFallback>
      </Avatar>
      <span className="text-xs">{BACKDROP_CREDIT.handle}</span>
    </Button>
  );
}
