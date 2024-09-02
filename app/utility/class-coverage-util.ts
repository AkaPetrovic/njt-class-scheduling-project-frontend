import ClassCoveragePlan from "../types/ClassCoveragePlan";
import Subject from "../types/Subject";

interface UnassignedClasses {
  unassignedLectureClasses: number;
  unassignedPracticalClasses: number;
  unassignedLabPracticalClasses: number;
}

interface AssignedClasses {
  assignedLectureClasses: number;
  assignedPracticalClasses: number;
  assignedLabPracticalClasses: number;
}

export const calculateAssignedClasses = (
  plans: ClassCoveragePlan[]
): AssignedClasses => {
  let assignedLectureClasses = 0;
  let assignedPracticalClasses = 0;
  let assignedLabPracticalClasses = 0;

  plans.forEach((plan) => {
    assignedLectureClasses += plan.amountOfLectureClassesPerTeachingStaff;
    assignedPracticalClasses += plan.amountOfPracticalClassesPerTeachingStaff;
    assignedLabPracticalClasses +=
      plan.amountOfLabPracticalClassesPerTeachingStaff;
  });

  return {
    assignedLectureClasses,
    assignedPracticalClasses,
    assignedLabPracticalClasses,
  };
};

export const calculateUnassignedClasses = (
  plans: ClassCoveragePlan[],
  numberOfStudentGroups: number,
  subject: Subject
): UnassignedClasses => {
  const {
    assignedLectureClasses,
    assignedPracticalClasses,
    assignedLabPracticalClasses,
  } = calculateAssignedClasses(plans);

  const unassignedLectureClasses =
    numberOfStudentGroups * subject.numberOfLectureClasses * 13 -
    assignedLectureClasses;
  const unassignedPracticalClasses =
    numberOfStudentGroups * subject.numberOfPracticalClasses * 13 -
    assignedPracticalClasses;
  const unassignedLabPracticalClasses =
    numberOfStudentGroups * subject.numberOfLabPracticalClasses * 13 -
    assignedLabPracticalClasses;

  return {
    unassignedLectureClasses,
    unassignedPracticalClasses,
    unassignedLabPracticalClasses,
  };
};
