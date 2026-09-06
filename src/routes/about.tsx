import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About the sellsweep prototype" },
      {
        name: "description",
        content:
          "What the sellsweep prototype shows: photos to posted listings across eBay, Etsy, Square, and Facebook Marketplace, with a copyright check.",
      },
      { property: "og:title", content: "About the sellsweep prototype" },
      {
        property: "og:description",
        content:
          "What this posting prototype covers, what it assumes, and what comes next.",
      },
    ],
  }),
  component: About,
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-lg font-medium">{title}</h2>
      <div className="mt-3 space-y-3 text-[0.95rem] leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

function About() {
  return (
    <AppShell step="Upload">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold">About this prototype</h1>

        <Section title="What sellsweep is">
          <p>
            Photograph an item, and get complete listings posted across eBay, Etsy, Square, and
            Facebook Marketplace. The thinking is done once instead of the transcription being done
            four times.
          </p>
        </Section>

        <Section title="What this prototype shows">
          <p>
            The posting flow, from photos to posted listings. That includes AI-drafted titles,
            descriptions and prices, per-marketplace pricing and shipping choices, and the
            copyright check that surfaces risk and asks the seller to accept it before posting.
          </p>
        </Section>

        <Section title="What is assumed">
          <p>
            The seller is already onboarded and their marketplace accounts are already connected.
          </p>
        </Section>

        <Section title="What is out of this prototype">
          <ul className="list-disc space-y-1 pl-5">
            <li>Onboarding and connecting accounts</li>
            <li>Managing or editing listings after they post</li>
            <li>Real AI calls</li>
            <li>Real marketplace posting</li>
            <li>Saving anything between visits</li>
            <li>Mobile. Optimized for desktop, mobile coming soon.</li>
          </ul>
        </Section>

        <Section title="What is next">
          <p>
            The onboarding and account-connection flow, listing management, and live marketplace
            connections.
          </p>
        </Section>

        <Section title="Who made it">
          <p>
            This is a prototype built by Katie Silorio to test a direction. There are no real users
            and no real data.
          </p>
        </Section>

        <div className="mt-10">
          <Link to="/" className="btn-ghost">
            Back to sellsweep
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
