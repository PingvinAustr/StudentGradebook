import { Discipline } from '../models/discipline.model'
import { Student } from '../models/student.model'


// app/models/assignment.model.ts
export interface Assignment {
  entryId: number;
  name: string;
  studentId: number;
  disciplineId: number;
  grade?: number;
  gradeDate?: Date;
  dueDate?: Date;
  // Relationships
  discipline?: Discipline;
  student?: Student;
}
