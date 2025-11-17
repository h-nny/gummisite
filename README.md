
<h1 align="center">Pokemon D&D — Grass Encounter Simulator</h1>

<p align="center">
	<img src="./public/grass-tile.png" alt="Product" width="200" />
</p>

<p align="center"><em>A small, local-first web app for simulating Pokémon-style grass encounters. Click grass tiles to roll for wild Pokémon, configure worlds and custom locations, and tune encounter and shiny chances.</em></p>

**Features**

- Clickable grass grid (default 5×5) with randomized encounters
- Create and manage worlds and custom locations (saved in `localStorage`)
- Per-location encounter tables and rates with a simple editor
- Shiny chance and global encounter chance sliders in Settings
- Animated Gen 5 sprites and text-based shiny indicator

**Tech Stack**

- Vite + React + TypeScript
- Tailwind CSS for styling
- LocalStorage for persistence

**Quick start**

Install dependencies (use Bun or npm/yarn):

```bash
bun install
# or
npm install
```

Run the dev server:

```bash
bun run dev
# or
npm run dev
```

Build for production:

```bash
bun run build
# or
npm run build
```

Deploy:

- This project is configured for static hosting (Cloudflare Pages). The `wrangler.toml` in the repo points Pages at the `./dist` output directory. Push the repo to your Pages-connected Git provider or run your preferred Pages publish command.

**Notes**

- The product image shown above uses the app's `grass-tile.png` asset at the repository root.
- The app stores worlds and custom locations in the browser `localStorage` so data remains on your machine.