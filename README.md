# sellsweep-prototype

Build a desktop web app called sellsweep. It is a clickable prototype of one flow: a seller uploads photos of items, AI turns them into finished marketplace listings, the seller reviews and adjusts them, confirms any copyright risk, and posts them to several marketplaces at once. There is no login, no real AI, no real marketplace connection, and no persistence. Every AI result is dummy data written into the app. Every marketplace action is simulated.

Name the project exactly sellsweep-prototype.

Design: minimal and sleek. Mostly white space, generous margins, a near-black text color, a muted grey for secondary text, one accent color used sparingly for primary buttons and selected states, a clean geometric sans typeface, line icons rather than emoji, rounded cards and soft shadows only where a card helps. Large, calm type. No dashboard clutter, no sidebar navigation, no marketing copy. The app should feel like a single focused tool that does one thing well. Never use an em dash anywhere in the app. Use a period, a comma, or a spaced hyphen instead.

Desktop only. On any viewport narrower than 900 pixels, do not render the app; render a single centered card that says sellsweep is optimized for desktop and mobile is coming soon.

Two persistent elements appear on every app screen. First, a thin banner across the top that tells the user this prototype assumes they are already onboarded, meaning their marketplace accounts are already connected, and that the prototype covers posting only. The banner links to the About page. Second, a small step indicator showing where the user is in the flow: Upload, Review, Summary, Post, Done.

The flow, in order: Upload, Analyzing, Review, Summary, Posting, Done. Plus an About page reachable from the banner. The screen blocks below describe each. Do not add screens, settings pages, account pages, or listing management. Do not add facts, prices, or marketplace names that are not in the blocks.

Dummy data lives in one place in the code so it is easy to change later. Use royalty-free stock photos of the three demo items if you can find good ones; otherwise render clean, clearly labeled placeholder image tiles carrying the item name. The photos should look like product photos, not icons.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/6a9c6025-c00c-4a1a-91ad-05279ce00cba).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

