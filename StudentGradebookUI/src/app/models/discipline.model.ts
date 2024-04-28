import { Assignment } from '../models/assignment.model'
import { Teacher } from '../models/teacher.model'

// app/models/discipline.model.ts
export interface Discipline {
  entryId: number;
  name: string;
  teacherId: number;
  // Relationships
  assignments?: Assignment[];
  teacher?: Teacher;
}
