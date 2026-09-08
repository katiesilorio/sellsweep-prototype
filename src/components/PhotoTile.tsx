import type { ReactNode } from "react";
import type { DemoPhoto } from "@/data/demo";

export type TileAction = {
  label: string;
  onClick: () => void;
  icon: ReactNode;
  /** Destructive actions render muted until hovered. */
  tone?: "default" | "destructive";
};

export function PhotoTile({
  photo,
  size = "md",
  actions,
  hideCaption,
}: {
  photo: DemoPhoto;
  size?: "sm" | "md" | "lg";
  /** Rendered side by side in the top-right corner, in the order given. */
  actions?: TileAction[];
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
      {actions && actions.length > 0 && (
        <div className="absolute right-1.5 top-1.5 flex items-center gap-1">
          {actions.map((a) => (
            <button
              key={a.label}
              type="button"
              aria-label={a.label}
              title={a.label}
              onClick={a.onClick}
              className={`flex size-6 items-center justify-center rounded-full border border-border bg-background shadow-card hover:bg-muted ${
                a.tone === "destructive"
                  ? "text-muted-foreground hover:text-foreground"
                  : "text-foreground"
              }`}
            >
              {a.icon}
            </button>
          ))}
        </div>
      )}
    </figure>
  );
}
