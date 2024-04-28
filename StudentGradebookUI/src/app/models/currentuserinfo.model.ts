import { Group } from '../models/group.model'
import { Teacher } from '../models/teacher.model'
import { Student } from '../models/student.model'

export enum Roles {
    Teacher,
    Student
}

export interface CurrentUserInfo {
  userName: string;
  webApiCredentialID: number;
  Role: Roles;
  Teacher: Teacher;
  Student: Student;
}