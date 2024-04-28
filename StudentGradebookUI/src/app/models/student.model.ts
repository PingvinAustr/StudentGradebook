import { Assignment } from '../models/assignment.model'
import { Group } from '../models/group.model'
import { WebApicredential } from '../models/webapicredential.model'

// app/models/student.model.ts
export interface Student {
  entryId: number;
  firstName: string;
  middleName: string;
  lastName: string;
  birthDate?: Date;
  webApiCredentialId: number;
  groupId: number;
  // Relationships
  email: string;
  phone: string;
  avatarImage: string;
  assignments?: Assignment[];
  group?: Group;
  webApiCredential?: WebApicredential;
}
