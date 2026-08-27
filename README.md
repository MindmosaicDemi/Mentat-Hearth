# Mentat-Hearth
Hearth — Grounded STEM Learning Companion A local-first, STEM-focused personal learning environment implementing the Affective Context Model (Nick Shackleton-Jones, How People Learn, 3rd ed., 2026).

Here is an upgraded architecture document tailored for **Vite + React + TypeScript** and optimized to guide local coding models like **Qwen Coder** to scaffold, implement, and verify the codebase cleanly without missing core application details.

---

# Hearth — Grounded STEM Learning Companion

A local-first, STEM-focused personal learning environment implementing the Affective Context Model (*Nick Shackleton-Jones, How People Learn, 3rd ed., 2026*).

Hearth operationalises a core premise: **learning is not knowledge transfer — it is the encoding of affective reactions to experiences**. The system never dumps unrequested content. It ingests local learner materials (textbooks, past papers, syllabi), reorganising them into an affective structure: a dynamic **concern map**, a **sequential reader** integrated with active challenges, point-of-need **resources**, and calibrated **experiences**.

---

## 1. Theoretical Foundation & Principles

Every component maps directly to findings from *How People Learn*:

* **Thinking is Feeling:** Cognition, memory, perception, and decision-making are affective processes. Memory stores emotional *reactions* to experiences rather than raw information, reconstructing memories from those reactions on demand.
* **Concerns Drive Retention:** Meaning drives memory, not repetition. Rote learning and forced spaced repetition target meaningless material. Learners acquire what matters to them ("if you don't feel it, you don't see it"). New concerns grow from existing ones.


* **Push vs. Pull:**
* **Pull (Performance Support):** Where concerns exist, provide task-centric resources at the point of need ($\le 1$ page, checklists, reference sheets) to reduce cognitive load or eliminate the need to learn.
* **Push (Designed Experiences):** Where concerns do not yet exist, construct emotionally impactful experiences (calibrated challenges, status moments, simulations, stories).




* **Measurement of Doing:** Mastery is evaluated solely through capability evidence (what a learner can *do* under specific conditions) rather than recall metrics, streaks, or completion percentages.


* **Local AI Role:** AI functions strictly as performance support or challenge design. It must never generate ungrounded content dumps, construct synthetic course pathways, or perform authoritative grading.



---

## 2. Technical Stack & Implementation Architecture

### Modern SPA Stack (Vite + React)

* **Build Tooling:** Vite, TypeScript, React 18+ (Functional Components, Custom Hooks).
* **Styling & UI Components:** Tailwind CSS, Radix UI primitives (or Lucide Icons) for scalable, dark-mode accessible UI components.
* **State & Persistence:**
* `dexie` (IndexedDBwrapper) for main entity storage, document chunks, and event logs.


* `Zustand` for global application state (active view routing, global reader session, active modals).


* **Search & Ingestion:**
* `pdfjs-dist` via Web Workers for PDF text-layer processing.
* `jszip` for client-side EPUB container unpacking.
* `minisearch` or custom BM25 web worker for fast local text searching over document chunks.


* **Local AI Driver:** Standard Fetch API hitting OpenAI-compatible endpoints (`http://localhost:11434/v1/chat/completions` for Ollama / LM Studio).

### System Layout & Directory Structure

```text
src/
├── assets/
├── components/
│   ├── common/            # Modals, Shell, Navigation Rails, UI Primitives
│   ├── ingestion/         # File Dropper, Chunk Progress, Data Mapper
│   ├── reader/            # PDF/EPUB Viewer, Prediction Drawer, Inline Resources
│   └── challenges/        # Conditions Dial, Commit Form, Rating Modal
├── context/               # Global state / Zustand stores
├── db/
│   ├── index.ts           # Dexie Database declaration
│   ├── schema.ts          # Type definitions & indices
│   └── services/          # Data access layer (DAL)
├── hooks/                 # Custom Hooks (useReader, useLocalAI, useSearch)
├── lib/
│   ├── ai/                # OpenAI Client wrapper & strict prompt templates
│   ├── ingestion/         # Processors for PDF, EPUB, and Syllabus parsing
│   └── search/            # BM25 Search Worker integration
├── views/                 # Top-level view router targets (home, reader, materials, etc.)
├── App.tsx
└── main.tsx

```

---

## 3. Product Architecture & Application Surfaces

Hearth is a single-user, local-first desktop application designed for STEM learners across exam-track and self-directed paths.

### Application Views & Surfaces

* **Welcome & Onboarding (`views/Welcome.tsx`):** First-run anchoring experience. Learner maps an interactive emotional curve, sorts STEM concern cards, and states personal stakes. No content displays until at least one concern is expressed.


* **Library & Ingestion (`views/Materials.tsx`):** Drag-and-drop ingestion of PDF/EPUB materials with explicit user confirmation mapping:


* *Syllabi* $\rightarrow$ Task map (actionable course requirements).


* *Past Papers* $\rightarrow$ Challenges (simulations under defined conditions).


* *Textbooks* $\rightarrow$ TOC index, sequential sections, and searchable resource chunks.




* **Study Map / Home (`views/Home.tsx`):** Core dashboard structured by concern clusters rather than topic trees. Provides direct affordances for **Do** (Resources), **Grow** (Challenges), and **Continue Reading**.


* **Sequential Reader / Trail (`views/Reader.tsx`):** Chapter and section working environment based on imported TOCs. Features free non-gated navigation rails, prediction-first prompts per section, linked resources, and targeted chapter challenges. Reading position persists locally.


* **Point-of-Need Resources / Find (`views/Resources.tsx`):** Task-first, $\le 1$ page performance support cards (worked examples, formula sheets, "top 10 mistakes") with exact text citations. Searchable by task and linked to specific source chunks.


* **Challenges / Experiences (`views/Challenges.tsx`):** Application problems, scenario simulations, and past-paper practice. Features a conditions dial (open-notes $\rightarrow$ timed $\rightarrow$ closed-book) and post-attempt challenge ratings.


* **Exam Campaigns (`views/Exams.tsx`):** Milestone planning for target exam dates. Coordinates past-paper mock runs, miss-to-section linking, and pinned reference sheets.
* **Ribbon Board / Evidence (`views/Accomplishments.tsx`):** Verifiable record of accomplishments (e.g., *"Sat 2024 Exam, Closed-Book, 82%"*). Omits progress bars, recall quiz scores, or completion percentages.


* **Reflection & Growth / Mirror (`views/Checkins.tsx`):** Event-log driven feedback loop tracking struggles, capability gains, and affective patterns. System challenge parameters recalibrated based on logged user ratings.



---

## 4. Interaction Mechanics & Evaluation

### The Encounter Sequence

Every active learning interaction follows four structural phases:

1. **Orient:** Contextualise the task via an expressed concern or application scenario.


2. **Commit:** Require a user prediction or structural approach before revealing solutions.
3. **Execute:** Work through the calculation, simulation, or section text.


4. **Rate & Record:** Capture post-task intensity (*"How challenging was this?"* on a 1–5 scale) alongside optional affect tags and story reflections.



### Evaluation & Grading Rules

* **No Gamification:** No points, streaks, artificial progress bars, or recall quizzes.


* **Hybrid Grading:** Automatic verification of numerical/unit answers paired with learner self-review against worked step-by-step solutions.
* **Accomplishment-Based Progress:** Progress is measured purely by completed experiences under stated constraints.



---

## 5. Production-Ready Data Models & Database Schema

```typescript
// src/db/schema.ts
import Dexie, { Table } from 'dexie';

export interface Person {
  id?: number;
  name: string;
  subject: string;
  curve: Array<{ at: string; feeling: string; note: string }>;
  stakeNote: string;
}

export interface Concern {
  id: string;
  label: string;
  cluster: string;
  strength: number;
  parentConcernId?: string;
}

export interface SourceDocument {
  id: string;
  type: 'textbook' | 'pastPaper' | 'syllabus';
  name: string;
  status: 'imported' | 'mapped';
  chunkCount: number;
  importedAt: string;
}

export interface DocumentChunk {
  id: string;
  sourceDocId: string;
  text: string;
  pageNumber?: number;
}

export interface Chapter {
  id: string;
  sourceDocId: string;
  index: number;
  title: string;
  sectionIds: string[];
  resourceIds: string[];
  experienceIds: string[];
}

export interface Section {
  id: string;
  chapterId: string;
  index: number;
  number: string;
  title: string;
  chunkIds: string[];
}

export interface Task {
  id: string;
  concernId: string;
  chapterId?: string;
  sectionId?: string;
  verb: string;
}

export interface Resource {
  id: string;
  taskId: string;
  type: 'excerpt' | 'workedExample' | 'formulaSheet' | 'top10' | 'quickRef';
  citation: string;
  helpsYouDo: string;
  sourceChunkId?: string;
}

export interface Experience {
  id: string;
  concernId: string;
  type: 'pastPaper' | 'problemSet' | 'scenario' | 'statusMoment';
  conditionsRange: 'open-notes' | 'timed' | 'closed-book';
  stakesLine: string;
  storyPrompt?: string;
}

export interface Accomplishment {
  id: string;
  experienceId?: string;
  chapterId?: string;
  sectionId?: string;
  evidence: string;
  earnedAt: string;
}

export interface EventLog {
  id: string;
  timestamp: string;
  type: 'encounter' | 'challenge' | 'reading';
  affectTags: string[];
  challengeRating: number; // 1-5 scale
  story?: string;
}

export interface ReadingPosition {
  id: string; // single key, e.g., 'current'
  bookId: string;
  chapterId: string;
  sectionId: string;
  updatedAt: string;
}

// Dexie Database Implementation
export class HearthDatabase extends Dexie {
  persons!: Table<Person>;
  concerns!: Table<Concern>;
  sourceDocuments!: Table<SourceDocument>;
  documentChunks!: Table<DocumentChunk>;
  chapters!: Table<Chapter>;
  sections!: Table<Section>;
  tasks!: Table<Task>;
  resources!: Table<Resource>;
  experiences!: Table<Experience>;
  accomplishments!: Table<Accomplishment>;
  eventLogs!: Table<EventLog>;
  readingPositions!: Table<ReadingPosition>;

  constructor() {
    super('HearthDB');
    this.version(1).stores({
      persons: '++id',
      concerns: 'id, cluster',
      sourceDocuments: 'id, type, status',
      documentChunks: 'id, sourceDocId',
      chapters: 'id, sourceDocId',
      sections: 'id, chapterId',
      tasks: 'id, concernId, chapterId',
      resources: 'id, taskId, type',
      experiences: 'id, concernId, type',
      accomplishments: 'id, experienceId, earnedAt',
      eventLogs: 'id, timestamp, type',
      readingPositions: 'id'
    });
  }
}

export const db = new HearthDatabase();

```

---

## 6. Implementation Guidelines for Qwen Coder

When generating React components and service logic for this project, adhere strictly to the following parameters:

1. **State Isolation:** Use Dexie's `useLiveQuery` hook in React components for automatic reactive re-rendering upon database mutation.
2. **Local AI Enforcement:** All LLM prompts sent to Ollama or local backends must append standard system system prompts restricting output to strict JSON schemas or direct performance coaching. AI MUST NOT generate answers, grading decisions, or curriculum trees independently.


3. **Visual Guardrails:** Avoid standard dashboard patterns featuring completion percentages ($0\% \rightarrow 100\%$), operational streak counters, or automated quiz scores. UI should emphasize proof of work (Accomplishments) and dynamic concern mapping.



---

## 7. Acceptance Verification Criteria

* [ ] **Onboarding Gate:** First open displays no content until $\ge 1$ concern is registered.


* [ ] **Ingestion Mapping:** Syllabus import generates a task map, past papers generate challenges, and textbooks generate a TOC index with resources.


* [ ] **Sequential Navigation:** Reader supports free navigation via chapter/section rails and Prev/Next toggles without gating. Reading position persists across reloads.


* [ ] **No Recall Metrics:** System contains zero recall quizzes, test scores, progress bars, or streak counters.


* [ ] **Task-First Resources:** All resources are accessed via task/concern entry points rather than topic indices.


* [ ] **Calibrated Challenges:** Every challenge surface includes conditions selection and a post-attempt *"How challenging was this?"* prompt.


* [ ] **Local Storage:** All application state persists locally to IndexedDB/localStorage with explicit "stays on this device" labels.
