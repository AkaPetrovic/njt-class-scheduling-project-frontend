import Subject from "./Subject";
import AcademicYear from "./AcademicYear";

export interface AcademicYearSubjectId {
  academicYearId: number;
  subjectId: number;
}

export default interface AcademicYearSubject {
  id: AcademicYearSubjectId;
  numberOfStudentGroups: number;
  academicYear: AcademicYear;
  subject: Subject;
}
