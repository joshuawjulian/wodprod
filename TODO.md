# Biomechanical Workout Planner - Todo List

## 🔴 Critical Fixes

- [ ] Fix `equipmentTable` schema - missing `id` column (line 67-70 in schema.ts)
- [ ] Add `parent_movement_id` column to movements table migration (referenced in schema but not in migration)
- [ ] Run database migration and test seed script
- [ ] Verify all foreign key constraints are working

## 📦 Dictionary Management (Admin CRUD)

### Movement Patterns ✅ COMPLETE
- [x] Create remote function for fetching all movement patterns
- [x] Create remote function for creating movement pattern
- [x] Create remote function for updating movement pattern
- [x] Create remote function for deleting movement pattern
- [x] Build out `/admin/dictionary/movement-patterns` page with data table
- [x] Add create/edit dialog with form validation
- [x] Add delete confirmation
- [x] Create ResponsiveModal component (dialog/drawer)
- [x] Implement mobile-responsive layout (table on desktop, cards on mobile)
- [x] Use Svelte 5 `{#each await}` syntax for data fetching
- [ ] Add loading skeleton instead of basic "Loading..." text
- [ ] Add search/filter functionality

### Modalities
- [ ] Create remote function for fetching all modalities
- [ ] Create remote function for creating modality
- [ ] Create remote function for updating modality
- [ ] Create remote function for deleting modality
- [ ] Build out `/admin/dictionary/modalities` page with data table
- [ ] Add create/edit dialog with form validation
- [ ] Add delete confirmation

### Equipment
- [ ] Create `equipment` module with actions
- [ ] Create remote function for fetching all equipment
- [ ] Create remote function for creating equipment
- [ ] Create remote function for updating equipment
- [ ] Create remote function for deleting equipment
- [ ] Build out `/admin/dictionary/equipment` page with data table
- [ ] Add create/edit dialog with form validation
- [ ] Add delete confirmation

### Movements
- [ ] Fix movements page (currently showing modalities instead of movements)
- [ ] Create remote function for fetching movements with relations (modality, patterns, equipment)
- [ ] Create remote function for creating movement with pattern associations
- [ ] Create remote function for updating movement
- [ ] Create remote function for deleting movement
- [ ] Build out `/admin/dictionary/movements` page with filterable data table
- [ ] Add multi-select for movement patterns in movement form
- [ ] Add multi-select for equipment in movement form
- [ ] Add parent movement selector (for progressions/regressions)
- [ ] Add video URL field with preview

## 🏋️ Core Application Features

### Gym Management
- [ ] Create gyms module with actions
- [ ] Create remote functions for gym CRUD operations
- [ ] Build out `/admin/gyms` page
- [ ] Add gym member management (many-to-many with users)
- [ ] Add gym role assignments (coach, athlete, etc.)
- [ ] Create gym-specific equipment inventory

### Workout Programming
- [ ] Design workout schema (workout sessions, programs, cycles)
- [ ] Create workout module with actions
- [ ] Build workout template creation UI
- [ ] Add movement pattern balancing logic
- [ ] Create workout generator based on movement patterns
- [ ] Add scaling logic (by modality: W -> G -> M)

### User Workouts
- [ ] Create user workout assignment system
- [ ] Build athlete dashboard showing assigned workouts
- [ ] Add workout logging interface
- [ ] Create performance tracking (weights, times, reps)
- [ ] Add progress visualization charts

## 👤 User Experience

### Authentication Flow
- [ ] Add email verification flow
- [ ] Add password reset functionality
- [ ] Add OAuth providers (Google, GitHub, etc.)
- [ ] Improve sign-in/sign-up UI with better error handling
- [ ] Add remember me functionality

### Dashboard
- [ ] Build user-facing dashboard for athletes
- [ ] Add recent workout history widget
- [ ] Add upcoming workouts widget
- [ ] Add personal records widget
- [ ] Add movement pattern balance visualization

### Profile & Settings
- [ ] Create user profile page
- [ ] Add user preferences (units, default gym, etc.)
- [ ] Add profile image upload
- [ ] Create settings page

## 🎨 UI/UX Improvements

- [x] Add toast notifications for success/error states (using svelte-sonner)
- [x] Add empty states for all list views (implemented in movement-patterns)
- [x] Create responsive mobile layouts (ResponsiveModal component)
- [ ] Create consistent loading states across all pages
- [ ] Implement skeleton loaders for data tables
- [ ] Add dark mode toggle (Tailwind already configured)
- [ ] Create breadcrumb navigation for admin sections

## 🔐 Authorization & Security

- [ ] Implement role-based access control (RBAC) middleware
- [ ] Add gym-scoped data access (users can only see their gym's data)
- [ ] Protect admin routes with role checks
- [ ] Add rate limiting for auth endpoints
- [ ] Implement CSRF protection
- [ ] Add input sanitization for all user inputs
- [ ] Create audit log for admin actions

## 🧪 Testing

- [ ] Set up Vitest for unit testing
- [ ] Write tests for auth actions
- [ ] Write tests for movement actions
- [ ] Write tests for workout generator logic
- [ ] Set up Playwright for E2E testing
- [ ] Create E2E tests for auth flow
- [ ] Create E2E tests for admin CRUD operations
- [ ] Create E2E tests for workout logging

## 📊 Data & Analytics

- [ ] Create analytics module for tracking user engagement
- [ ] Build admin analytics dashboard
- [ ] Add movement frequency reports
- [ ] Add pattern balance reports across gym
- [ ] Create exportable workout logs (CSV, PDF)

## 🚀 DevOps & Deployment

- [ ] Set up CI/CD pipeline
- [ ] Configure production environment variables
- [ ] Set up database backups
- [ ] Configure error tracking (Sentry, etc.)
- [ ] Set up monitoring and logging
- [ ] Create deployment documentation
- [ ] Set up staging environment

## 📝 Documentation

- [ ] Document database schema and relationships
- [ ] Create API documentation for remote functions
- [ ] Write developer setup guide
- [ ] Create user manual for coaches
- [ ] Create user manual for athletes
- [ ] Document movement taxonomy and philosophy

## 🔄 Technical Debt & Refactoring

- [x] Standardize error handling across all modules (Result types) - using neverthrow
- [x] Create shared Zod schemas for form validation (MovementPatternFormSchema, etc.)
- [x] Extract common UI patterns into reusable components (ResponsiveModal)
- [ ] Remove unused `refreshKey` variable from movement-patterns page
- [ ] Add proper TypeScript types for all database queries
- [ ] Implement proper logging strategy
- [ ] Review and optimize database queries
- [ ] Add database indexes where needed

## 🎯 Future Enhancements (Phase 2)

- [ ] Mobile app (React Native or PWA)
- [ ] Exercise demonstration videos
- [ ] AI-powered workout recommendations
- [ ] Integration with fitness trackers (Whoop, Garmin, etc.)
- [ ] Social features (workout sharing, leaderboards)
- [ ] Marketplace for workout programs
- [ ] Video analysis for movement quality
- [ ] Nutrition tracking integration
