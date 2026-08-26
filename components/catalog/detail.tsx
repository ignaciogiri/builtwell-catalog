import Image from "next/image";
import type { CatalogItem } from "@/lib/db/queries";
import { formatDate } from "@/lib/utils";
import { ShareButton } from "./share-button";

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-8 py-2.5">
      <dt className="shrink-0 text-[15px] text-white">{label}</dt>
      <dd className="text-right text-[15px] text-white/55">{value}</dd>
    </div>
  );
}

export function Detail({
  item,
  image,
}: {
  item: CatalogItem;
  image: string | null;
}) {
  return (
    // 24px matches the header, the sidebar, and where the nav rows land
    // (nav p-3 + row px-3), so every panel shares one inset.
    <div className="px-6 py-6">
      {/* Assets carry their own backgrounds and vary in aspect, so the frame
          takes the image's intrinsic ratio rather than forcing a square. */}
      <div
        className="relative w-full overflow-hidden rounded-xl border border-white/10"
        style={{
          aspectRatio:
            item.imageWidth && item.imageHeight
              ? `${item.imageWidth} / ${item.imageHeight}`
              : "1 / 1",
        }}
      >
        {image ? (
          <Image
            alt={`${item.name} icon`}
            className="object-cover"
            fill
            priority
            sizes="480px"
            src={image}
          />
        ) : null}
      </div>

      <dl className="mt-6 divide-y divide-white/10">
        <Field
          label="Name"
          value={
            <span className="inline-flex items-center gap-2">
              {item.name}
              {item.badge ? (
                <span className="rounded-full bg-orange-400 px-2 py-0.5 font-medium text-[11px] text-orange-950 tracking-wide">
                  {item.badge}
                </span>
              ) : null}
            </span>
          }
        />
        <Field label="Date added" value={formatDate(item.dateAdded)} />
        {item.tags.length > 0 ? (
          <Field label="Tags" value={item.tags.join(", ")} />
        ) : null}
      </dl>

      {item.description ? (
        <div className="mt-6">
          <h2 className="text-[15px] text-white">Description</h2>
          <p className="mt-2 text-[15px] text-white/55 leading-relaxed">
            {item.description}
          </p>
        </div>
      ) : null}

      <div className="mt-7 flex items-center gap-2.5">
        <ShareButton category={item.category} slug={item.slug} />
        {item.url ? (
          <a
            className="inline-flex items-center rounded-full bg-white px-6 py-2.5 font-medium text-[15px] text-black transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 transition-transform duration-100 ease-out active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100"
            href={item.url}
            rel="noreferrer noopener"
          >
            Visit
          </a>
        ) : null}
      </div>
    </div>
  );
}
