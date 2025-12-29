# Project Context: Biomechanical Workout Planner

## Stack:

Typescript VIA Bun, Sveltekit (using Svelte 5 + features like runes), Postgres, Better-auth, Drizzle-kit (1.0 Beta), Shadcn-Svelte, Tailwindcss

Using await expressions and remote functions for sveltekit. see: https://svelte.dev/docs/kit/remote-functions/llms.txt https://svelte.dev/docs/svelte/await-expressions/llms.txt

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
