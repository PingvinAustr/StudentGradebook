import { Group } from '../models/group.model'
import { Teacher } from '../models/teacher.model'

// app/models/cafedra.model.ts
export interface Cafedra {
  entryId: number;
  name: string | null;
  // Relationships
  groups?: Group[];
  teachers?: Teacher[];
}
