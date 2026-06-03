# data-table

A small React + Vite demo that uses shadcn/ui table styles and TanStack Table to display users fetched from the DummyJSON API. The project shows how to configure a Vite env var, use `axios` for requests, and render a responsive table component.

## Features

- Shadcn-style table UI (components in [src/components/ui](src/components/ui))
- TanStack Table (`@tanstack/react-table`) for table logic
- Fetches fake user data from DummyJSON using `axios`
- Vite env var for API base (`VITE_DUMMYJSON_API`)

## Prerequisites

- Node.js 18+ and npm
- Git (optional)

## Quick start

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start dev server:

   ```bash
   npm run dev
   ```

3. Open http://localhost:5173 in your browser (Vite prints the exact URL).

## Environment

This project reads the DummyJSON API base from a Vite environment variable named `VITE_DUMMYJSON_API`. The repository includes a `.env` file with a default value. To override it, create or edit `.env` at the project root:

```
VITE_DUMMYJSON_API=https://dummyjson.com
```

After changing `.env` restart the dev server so Vite picks up the new value.

## Project structure (key files)

- [src/App.jsx](src/App.jsx) — App entry; loads users from the API and passes them to the table
- [src/components/DataTable.jsx](src/components/DataTable.jsx) — Table wrapper component using `@tanstack/react-table`
- [src/components/ui/table.jsx](src/components/ui/table.jsx) — shadcn-style table primitives (Table, TableRow, TableCell, etc.)
- [src/lib/utils.js](src/lib/utils.js) — lightweight `cn()` helper (`clsx` + `tailwind-merge`)
- [vite.config.js](vite.config.js) — Vite config and path alias (`@` → `src`)
- [.env](.env) — project env (contains `VITE_DUMMYJSON_API`)

## How it works

- [src/App.jsx](src/App.jsx) uses `axios` to GET `${import.meta.env.VITE_DUMMYJSON_API}/users?limit=20` and stores results in state.
- `DataTable` receives `columns` and `data` and uses `useReactTable` to derive headers/rows, then renders using the shadcn UI primitives.

## Available scripts

- `npm run dev` — start Vite dev server
- `npm run build` — build for production
- `npm run preview` — locally preview production build
- `npm run lint` — run ESLint

## Troubleshooting

- If the API data does not load: ensure `.env` contains `VITE_DUMMYJSON_API` or that the fallback (`https://dummyjson.com`) is reachable.
- After editing `.env` restart the dev server.
- If you add or change path aliases, ensure `jsconfig.json` (or `tsconfig.json`) contains the matching alias so tools like shadcn CLI can detect imports.

## Extending

- Replace DummyJSON with your real API by changing `VITE_DUMMYJSON_API`.
- Add sorting/pagination by leveraging additional TanStack Table features in `DataTable.jsx`.

## Contributing

Open a PR or issue. Keep changes focused and add a brief description of what you changed.

## License

This repository does not include a license by default. Add a `LICENSE` file if you want to make the project open source.
