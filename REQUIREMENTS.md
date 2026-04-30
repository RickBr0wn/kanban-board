# Kanban Board — Product Requirements Document

**Author:** Richard Brown  
**Created:** 2026-04-30  
**Status:** Draft

---

## 1. Overview

A personal Kanban board web application for managing tasks and projects. Built incrementally using modern web tooling, guided by professional development practices.

---

## 2. Goals

- A fast, responsive board UI usable day-to-day for personal task management
- Persistent data (survives page refresh)
- Clean, minimal dark-mode-first design that doesn't get in the way
- Codebase that can grow without becoming a mess

---

## 3. Non-Goals (for now)

- Multi-user / team collaboration
- Real-time sync across devices
- Mobile app (web only, responsive is fine)
- Email notifications

---

## 4. Core Features

### Phase 1 — Foundation (MVP)

- [ ] Create, rename, and delete **boards**
- [ ] Create, rename, and delete **columns** (e.g. To Do / In Progress / Done)
- [ ] Create, edit, and delete **cards** within columns
- [ ] Drag-and-drop cards between columns
- [ ] Data persisted in browser localStorage

### Phase 2 — Richer Cards

- [ ] Card descriptions (markdown support)
- [ ] Due dates on cards
- [ ] Priority labels (Low / Medium / High / Critical)
- [ ] Color-coded labels / tags

### Phase 3 — Persistence & Data

- [ ] Backend API (replace localStorage)
- [ ] Database storage (PostgreSQL via Supabase or similar)
- [ ] User authentication (sign in with GitHub / Google)
- [ ] Data scoped to logged-in user

### Phase 4 — Polish

- [ ] Board-level search / filter by label or text
- [ ] Card activity log (created, moved, edited)
- [ ] Archive and restore cards
- [ ] Keyboard shortcuts
- [ ] Light mode toggle (dark is the permanent default)

---

## 5. User Stories

| As a user I want to…                     | So that…                             |
| ---------------------------------------- | ------------------------------------ |
| Create a new board                       | I can organize separate projects     |
| Add columns to a board                   | I can define my own workflow stages  |
| Add cards to a column                    | I can capture tasks                  |
| Drag a card to another column            | I can update a task's status quickly |
| Edit a card's title and description      | I can add detail to a task           |
| Delete a card or column I no longer need | The board stays clean                |
| Have my data persist across sessions     | I don't lose my work                 |

---

## 6. Data Model (initial)

```
Board
  id         string
  title      string
  createdAt  date

Column
  id         string
  boardId    string  (FK → Board)
  title      string
  order      number

Card
  id          string
  columnId    string  (FK → Column)
  title       string
  description string  (optional)
  order       number
  createdAt   date
```

---

## 7. Tech Stack

| Layer                 | Choice               | Reason                                        |
| --------------------- | -------------------- | --------------------------------------------- |
| Framework             | Next.js (App Router) | Consistent with your existing portfolio setup |
| Language              | TypeScript           | Catches errors early, great DX                |
| Styling               | Tailwind CSS         | Fast to write, easy to maintain               |
| Drag & Drop           | `@dnd-kit/core`      | Modern, accessible, actively maintained       |
| State                 | Zustand              | Lightweight, simple API for local state       |
| Persistence (Phase 1) | localStorage         | No backend required to start                  |
| Persistence (Phase 3) | Supabase             | Hosted Postgres + auth with minimal setup     |

---

## 8. Build Phases & Milestones

| Milestone | Deliverable                                            |
| --------- | ------------------------------------------------------ |
| M1        | Project scaffolding — Next.js + Tailwind + TypeScript  |
| M2        | Static board layout — hardcoded columns and cards      |
| M3        | Dynamic state — add/edit/delete boards, columns, cards |
| M4        | Drag-and-drop — cards reorder and move between columns |
| M4.5      | Drag-and-drop — columns reorder within a board         |
| M5        | LocalStorage persistence — data survives refresh       |
| M6        | Richer cards — descriptions, due dates, labels         |
| M6.5      | Add card uses full modal (labels, priority, due date)  |
| M7        | Backend + auth — Supabase integration                  |
| M8        | Polish — search, keyboard shortcuts, light mode toggle |

---

## 9. Definition of Done (per feature)

- Feature works as described in the user story
- No TypeScript errors
- No obvious accessibility issues (keyboard navigable, meaningful labels)
- Looks correct on desktop (1280px) and tablet (768px)

---

## 10. Open Questions

- [ ] Should the app support multiple boards, or just one?
- [ ] What drag-and-drop behaviour is expected when reordering columns?
- [ ] Should cards have file attachments eventually?
