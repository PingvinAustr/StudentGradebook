import { Cafedra } from '../models/cafedra.model'
import { Student } from '../models/student.model'

export interface Group {
  entryId: number;
  name: string | null;
  cafedraId: number | null;
  // Relationships
  cafedra?: Cafedra;
  students?: Student[];
}
