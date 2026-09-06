import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PhotoTile } from "@/components/PhotoTile";
import { useSellsweep } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "sellsweep, post one item to every marketplace" },
      {
        name: "description",
        content:
          "sellsweep prototype. Upload photos, let AI draft the listings, then post to eBay, Etsy, Square, and Facebook Marketplace at once.",
      },
      { property: "og:title", content: "sellsweep, post one item to every marketplace" },
      {
        property: "og:description",
        content: "A clickable prototype of the sellsweep posting flow, from photos to posted listings.",
      },
    ],
  }),
  component: Upload,
});

function ModeDialog({ onPick }: { onPick: (m: "one" | "multiple") => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 px-6">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-card">
        <h2 className="text-lg font-medium">Are you uploading one listing or multiple listings?</h2>
        <div className="mt-6 flex justify-center gap-3">
          <button className="btn-primary" onClick={() => onPick("one")}>
            One listing
          </button>
          <button className="btn-ghost" onClick={() => onPick("multiple")}>
            Multiple listings
          </button>
        </div>
      </div>
    </div>
  );
}

function Upload() {
  const navigate = useNavigate();
  const s = useSellsweep();
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (s.mode === null) setDialogOpen(true);
  }, [s.mode]);

  const groupsReady =
    s.groups.length > 0 && s.groups.every((g) => g.photoIds.length > 0) && s.ungroupedPhotos.length === 0;
  const canContinue =
    s.mode === "one" ? s.availablePhotos.length > 0 : s.photosLoaded && groupsReady;

  function next() {
    s.buildListings();
    navigate({ to: "/analyzing" });
  }

  return (
    <AppShell step="Upload">
      {dialogOpen && (
        <ModeDialog
          onPick={(m) => {
            s.setMode(m);
            setDialogOpen(false);
          }}
        />
      )}

      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-semibold">Start with photos</h1>
        <p className="mt-3 text-muted-foreground">
          sellsweep reads your photos and writes the listings for you.
        </p>

        <div className="mt-12 rounded-2xl border border-dashed border-border px-10 py-16">
          <button className="btn-primary" onClick={() => s.loadPhotos(s.mode === "one" ? "one" : "multiple")}>
            Add photos
          </button>
          <p className="mt-4 text-xs text-muted-foreground">
            Demo photos are added for you in this prototype.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            {s.mode === "one" ? "One listing" : "Multiple listings"}{" "}
            <button
              className="text-primary underline underline-offset-2"
              onClick={() => setDialogOpen(true)}
            >
              Change
            </button>
          </p>
        </div>
      </div>

      {s.photosLoaded && s.mode === "one" && (
        <div className="mx-auto mt-12 max-w-3xl">
          <div className="flex flex-wrap gap-5">
            {s.availablePhotos.map((p) => (
              <PhotoTile key={p.id} photo={p} />
            ))}
          </div>
        </div>
      )}

      {s.photosLoaded && s.mode === "multiple" && (
        <div className="mt-12">
          <div className="sticky top-0 z-10 border-b border-border bg-background pb-5 pt-4">
            <h2 className="text-lg font-medium">Ungrouped photos</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Click the plus on a photo to add it to the selected listing.
            </p>
            <div className="mt-4 flex flex-wrap gap-4">
              {s.ungroupedPhotos.length === 0 && (
                <p className="text-sm text-muted-foreground">Every photo is assigned.</p>
              )}
              {s.ungroupedPhotos.map((p) => (
                <PhotoTile
                  key={p.id}
                  photo={p}
                  action={{
                    label: "Add to selected listing",
                    symbol: "+",
                    onClick: () => s.assignPhoto(p.id),
                  }}
                />
              ))}
            </div>
          </div>

          <div className="mt-8 space-y-4">
            {s.groups.map((g) => (
              <div
                key={g.id}
                role="button"
                tabIndex={0}
                onClick={() => s.selectGroup(g.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") s.selectGroup(g.id);
                }}
                className={`block w-full cursor-pointer rounded-2xl border p-5 text-left ${
                  s.selectedGroupId === g.id
                    ? "border-primary bg-primary/[0.03]"
                    : "border-border bg-card"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{g.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {s.selectedGroupId === g.id ? "Selected" : "Click to select"}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-4">
                  {g.photoIds.length === 0 && (
                    <p className="text-sm text-muted-foreground">No photos yet.</p>
                  )}
                  {g.photoIds.map((pid) => {
                    const photo = s.availablePhotos.find((p) => p.id === pid);
                    if (!photo) return null;
                    return (
                      <PhotoTile
                        key={pid}
                        photo={photo}
                        action={{
                          label: "Remove from listing",
                          symbol: "\u2715",
                          onClick: () => s.unassignPhoto(pid),
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            ))}

            <button className="btn-ghost" onClick={s.addGroup}>
              Add a listing
            </button>
          </div>
        </div>
      )}

      <div className="mt-14 flex flex-col items-center">
        <button className="btn-primary" disabled={!canContinue} onClick={next}>
          Next
        </button>
        {s.mode === "multiple" && s.photosLoaded && !canContinue && (
          <p className="mt-3 text-xs text-muted-foreground">
            Assign every photo to a listing to continue.
          </p>
        )}
      </div>
    </AppShell>
  );
}
