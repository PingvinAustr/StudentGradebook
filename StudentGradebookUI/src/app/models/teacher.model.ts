import { Discipline } from '../models/discipline.model'
import { Cafedra } from '../models/cafedra.model'
import { WebApicredential } from '../models/webapicredential.model'

export interface Teacher {
  entryId: number;
  firstName: string;
  middleName: string;
  lastName: string;
  birthDate?: Date;
  webApiCredentialId: number;
  cafedraId: number;
  email: string;
  phone: string;
  avatarImage: string;
  // Relationships
  cafedra?: Cafedra;
  disciplines?: Discipline[];
  webApiCredential?: WebApicredential;
}
