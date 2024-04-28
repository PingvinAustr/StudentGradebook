import { Student } from '../models/student.model'
import { Teacher } from '../models/teacher.model'

// app/models/webapicredential.model.ts
export interface WebApicredential {
  entryId: number;
  userName: string;
  password: string;
  // Relationships
  students?: Student[];
  teachers?: Teacher[];
}
