# Kanban Board

A fast, responsive Kanban board application for personal task management. Built with modern web tooling and professional development practices.

## Features

- **Create & manage boards** — Organize separate projects
- **Drag-and-drop cards** — Reorder tasks and move them between columns
- **Persistent storage** — Data saved to localStorage (browser-based for now)
- **Dark-mode first** — Clean, minimal design that stays out of the way
- **Type-safe** — Full TypeScript support, catch errors early

See [REQUIREMENTS.md](./REQUIREMENTS.md) for the full feature roadmap and design philosophy.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Drag & Drop:** @dnd-kit/core
- **State Management:** Zustand
- **Persistence:** localStorage (Phase 1)

## Getting Started

### Prerequisites

- Node.js 18+ (20+ recommended)
- npm, yarn, pnpm, or bun

### Installation & Development

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Available Scripts

```bash
npm run dev      # Start development server (hot reload)
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## Project Structure

```
src/
├── app/              # Next.js App Router pages and layouts
├── components/       # React components (boards, columns, cards)
└── lib/
    └── store.ts      # Zustand state management
public/              # Static assets
```

## Development Workflow

1. **Make changes** — Edit `.tsx` files; the dev server auto-refreshes
2. **Type-check** — TypeScript catches errors as you type
3. **Build & test** — Run `npm run build` before committing to catch issues
4. **Commit** — Use conventional commits (e.g., "feat: add card labels")

## Next Steps

- See [REQUIREMENTS.md](./REQUIREMENTS.md) for the feature roadmap
- Review the current milestone to understand what's being built
- Run `npm run dev` and start exploring the codebase

## License

Personal project.
