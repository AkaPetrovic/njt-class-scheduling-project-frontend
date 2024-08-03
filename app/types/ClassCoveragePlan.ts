import TeachingStaff from "./TeachingStaff";
import Subject from "./Subject";
import AcademicYear from "./AcademicYear";

export default interface ClassCoveragePlan {
  id: number;
  amountOfLectureClassesPerTeachingStaff: number;
  amountOfPracticalClassesPerTeachingStaff: number;
  amountOfLabPracticalClassesPerTeachingStaff: number;
  teachingStaff: TeachingStaff;
  subject: Subject;
  academicYear: AcademicYear;
}
