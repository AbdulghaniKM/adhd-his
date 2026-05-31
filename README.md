# ADHD HIS (Hospital Information System)

A comprehensive health information system tailored for managing ADHD patients and clinic workflows, built with a modern frontend stack.

## Roles & Features

The application features dedicated interfaces for different clinical roles:
- **Admin**: System management, user control, and clinic oversight.
- **Doctor**: Patient management, diagnosis, and treatment planning.
- **Lab Technician**: Managing lab tests, results, and diagnostics.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Vue 3.5 with `<script setup>` + Composition API |
| Styling | Tailwind CSS v4 with CSS variable theming |
| Language | TypeScript 5.7 (strict) |
| Build | Vite 7 |
| State | Pinia 3 |
| Routing | Vue Router 4 |
| Validation | Zod 4 |
| HTTP | Axios (interceptors, CSRF, auth token plumbing) |

## Quick Start

```bash
# Clone the repository
git clone https://github.com/AbdulghaniKM/adhd-his.git
cd adhd-his

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

Copy `.env.example` to `.env` and set your values:

```bash
cp .env.example .env
```

## Project Structure

```text
src/
├── components/          # Reusable UI components
├── composables/         # Vue composables
├── config/              # App configuration & constants
├── layout/              # Layout wrappers
├── pages/               # Route page components (admin, doctor, lab-tech, etc.)
├── plugins/             # Vue plugins (e.g., Axios setup)
├── router/              # Vue Router configuration
├── services/            # API service calls
├── stores/              # Pinia state management
├── types/               # TypeScript type definitions
└── utils/               # Helper functions
```

## Scripts

```bash
pnpm dev        # Start dev server
pnpm build      # Type-check + production build
pnpm preview    # Preview production build
pnpm lint       # Run ESLint
pnpm format     # Run Prettier
```

## License

MIT
