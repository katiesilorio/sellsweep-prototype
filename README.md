# sellsweep prototype

A clickable prototype of sellsweep's posting flow: photograph an item, let AI draft the listing, review it, accept any copyright risk, and post it to eBay, Etsy, Square, and Facebook Marketplace at once.

**Try it:** [sellsweep-prototype.lovable.app](https://sellsweep-prototype.lovable.app/), or the short link [bit.ly/sellsweep-prototype](https://bit.ly/sellsweep-prototype). Desktop only; mobile shows a notice.

Everything in the prototype is simulated. There is no login, no real AI call, no real marketplace connection, and nothing is saved between visits. The demo items, prices, comparables, and marketplace pages are dummy data written for the demo.

## What sellsweep is

Selling online means re-creating the same listing on every marketplace. Each one wants the same information, photos, title, description, price, category, in a different shape with a different taxonomy. The thinking gets done once; the transcription gets done four times. sellsweep does the thinking once and removes the transcription.

## What the prototype shows

- **Upload.** One listing or several. Photos are grouped into listings by hand; nothing moves forward until every photo belongs to a listing.
- **Analyzing.** The steps the AI runs: reading photos, identifying items, writing titles and descriptions, researching comparable prices, checking for copyright risk.
- **Review.** Every AI draft is editable. Per marketplace, the seller chooses a price strategy (the suggested price, or a custom one) and a shipping strategy (the customer pays, or shipping is folded into the price with free shipping), and sees what the buyer will see. A comparables popup shows the listings the price was based on, per marketplace. Settings can be applied across marketplaces within a listing, or across listings.
- **Copyright check.** An item the seller made that carries someone else's logo is flagged on Review and again on Summary, and the seller has to consciously accept the risk before posting. The prototype never refuses to post and never hides a marketplace; it surfaces the risk and makes the decision explicit.
- **Summary, Posting, Done.** What will post where, a simulated posting run, and a simulated listing page per marketplace, each following that marketplace's page conventions (no logos or brand marks).
- **About.** What is in, what is out, and what is next, inside the app.

## The automation already exists

The working part of sellsweep is built as a Claude skill: photos in, item identified, listing written, price researched against comparables, copyright risk checked, and the listing posted to the four marketplaces. It runs today, as a conversation, to help a real seller list handmade items. What it lacks is a front end. This prototype is the front end, built to work out what the seller should see and control at each step. The next step is combining the two.

## How it was built

The first draft was generated in [Lovable](https://lovable.dev) from a written spec, for the look and feel. Every functional change after that was made in the code with Claude and pushed to this repository, which Lovable syncs. The app is a TanStack Start (React) project.

To run it locally you need Node.js and npm:

```sh
git clone https://github.com/katiesilorio/sellsweep-prototype.git
cd sellsweep-prototype
npm i
npm run dev
```

The dummy data lives in `src/data/demo.ts`. The screens are in `src/routes/`. The simulated marketplace pages are in `src/components/ListingPreview.tsx`.

## Who made it

Katie Silorio, September 2026. A prototype built to test a direction. No real users, no real data, no real posts.
