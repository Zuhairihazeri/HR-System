# HR-SaaS Project Plan: Phase 5 - Pekerja (Employee) Module
*Plan lifecycle management with tracked execution and context recovery*

## Architecture
- **Server Actions**: `src/lib/actions/pekerja.ts` (CRUD logic with Prisma).
- **Routes**:
  - `src/app/(dashboard)/pekerja/page.tsx` (Employee list).
  - `src/app/(dashboard)/pekerja/new/page.tsx` (Add employee form).
  - `src/app/(dashboard)/pekerja/[id]/page.tsx` (Employee details & edit).
- **Components**:
  - `src/components/pekerja/PekerjaTable.tsx` (Data table).
  - `src/components/pekerja/PekerjaForm.tsx` (Reusable form component).

---

## Tasks

- [x] **Task 1: Server Actions Setup**
    - Create `src/lib/actions/pekerja.ts`.
    - Implement `getPekerja()`, `createPekerja()`, `updatePekerja()`, and `deletePekerja()`.
- [ ] **Task 2: UI Implementation - Employee List**
    - Create `src/app/(dashboard)/pekerja/page.tsx`.
    - Implement the `PekerjaTable` component with search and filtering.
- [ ] **Task 3: UI Implementation - Add Employee Form**
    - Create `src/app/(dashboard)/pekerja/new/page.tsx`.
    - Create a reusable `PekerjaForm`.
- [ ] **Task 4: UI Implementation - Edit/Details Page**
    - Create `src/app/(dashboard)/pekerja/[id]/page.tsx`.
    - Populate the form with existing data and handle updates.
- [ ] **Task 5: Validation & Integration**
    - Add Zod validation for form inputs.
    - Test all CRUD operations.
