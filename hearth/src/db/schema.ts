import Dexie, { type Table } from 'dexie';

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
