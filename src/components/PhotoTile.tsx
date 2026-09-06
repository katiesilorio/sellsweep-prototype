import type { DemoPhoto } from "@/data/demo";

export function PhotoTile({
  photo,
  size = "md",
  action,
  hideCaption,
}: {
  photo: DemoPhoto;
  size?: "sm" | "md" | "lg";
  action?: { label: string; onClick: () => void; symbol: string };
  hideCaption?: boolean;
}) {
  const box = size === "sm" ? "size-16" : size === "lg" ? "aspect-square w-full" : "size-32";
  return (
    <figure className="relative">
      <div className={`${box} overflow-hidden rounded-xl border border-border bg-muted`}>
        <img
          src={photo.src}
          alt={photo.label}
          loading="lazy"
          width={1024}
          height={1024}
          className="size-full object-cover"
        />
      </div>
      {size !== "sm" && !hideCaption && (
        <figcaption className="mt-1.5 text-[0.7rem] text-muted-foreground">
          {photo.label}
        </figcaption>
      )}
      {action && (
        <button
          type="button"
          aria-label={action.label}
          title={action.label}
          onClick={action.onClick}
          className="absolute right-1.5 top-1.5 flex size-6 items-center justify-center rounded-full border border-border bg-background text-sm leading-none text-foreground shadow-card hover:bg-muted"
        >
          {action.symbol}
        </button>
      )}
    </figure>
  );
}
