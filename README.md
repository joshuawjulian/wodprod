# Biomechanical Workout Planner

A web application for generating and tracking workouts based on Movement Patterns rather than isolated muscle groups. Built with modern TypeScript, SvelteKit, and Postgres.

## Stack

- **Runtime:** Bun
- **Framework:** SvelteKit with Svelte 5 (runes, await expressions)
- **Database:** PostgreSQL with Drizzle ORM (v1.0 Beta)
- **Auth:** Better-auth
- **UI:** Shadcn-Svelte + TailwindCSS v4
- **Validation:** Zod schemas
- **Error Handling:** neverthrow (Result types)

## Key Documentation

- **Remote Functions:** https://svelte.dev/docs/kit/remote-functions/llms.txt
- **Await Expressions:** https://svelte.dev/docs/svelte/await-expressions/llms.txt
- **Project Context:** See `CONTEXT.md` for session notes and progress
- **Todo List:** See `TODO.md` for current tasks and priorities

## Project Context for Claude

When starting a new session, reference these files:
1. **README.md** (this file) - Tech stack and project overview
2. **CONTEXT.md** - Session notes and recent progress
3. **TODO.md** - Current tasks and what's completed/pending

### Explicit naming:

tables are suffixed with Table. Types are suffixed with Type. Schemas (zod) are suffixed with Schema.

### Explicit Errors:

Where possible, no throwing. All returns will be typed as Result type with <Value, Error>

1. Core Philosophy
   This web application generates and tracks workouts based on Movement Patterns rather than isolated muscle groups. It prioritizes functional alignment, structural balance, and intelligent scaling over arbitrary exercise selection.

2. The 10-Point Movement Taxonomy
   These are the immutable "Primary Keys" for sorting movements.

Squat: Bilateral knee-dominant (e.g., Back Squat).

Hinge: Bilateral hip-dominant (e.g., Deadlift).

Lunge: Unilateral knee-dominant (e.g., Split Squat).

Push (Horizontal): Anterior upper body (e.g., Bench Press).

Push (Vertical): Overhead upper body (e.g., Military Press).

Pull (Horizontal): Posterior upper body (e.g., Row).

Pull (Vertical): Overhead pulling (e.g., Pull-up).

Rotation: Torque production (e.g., Med Ball Throw).

Core: Stability/Anti-movement (e.g., Plank, Pallof Press).

Gait / Locomotion: Cyclical travel (e.g., Run, Farmer Carry).

3. Differentiation Logic
   To distinguish mechanically similar exercises with different physiological intents, we use Modality tags.

Modality,Intent,Logic Example
Monostructural (M),Cardio / Metabolic,"Running, Rowing"
Gymnastics (G),Body control / Relative Strength,"Air Squat, Pull-up"
Weightlifting (W),Structural Load / Absolute Strength,"Weighted Lunge, Deadlift"
