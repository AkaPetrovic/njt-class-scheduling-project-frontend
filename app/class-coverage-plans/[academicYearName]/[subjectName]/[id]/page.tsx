import ClassCoveragePlan from "@/app/types/ClassCoveragePlan";
import ClassCoveragePlanDetailsForm from "./ClassCoveragePlanDetailsForm";
import { cookies } from "next/headers";
import AcademicYearSubject from "@/app/types/AcademicYearSubject";
import Subject from "@/app/types/Subject";
import { calculateUnassignedClasses } from "@/app/utility/class-coverage-util";

interface Props {
  params: {
    id: number;
    academicYearName: string;
    subjectName: string;
  };
}

const ClassCoveragePlanDetailsPage = async ({
  params: { id, academicYearName, subjectName },
}: Props) => {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  const resAcademicYearSubject = await fetch(
    `http://localhost:8080/api/academic-year-subject/${academicYearName}/${subjectName}`,
    {
      cache: "no-store",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    }
  );

  //Render an appropriate message if no AcademicYearSubject has been found
  if (!resAcademicYearSubject.ok) {
    const errorMessage = await resAcademicYearSubject.text();
    return (
      <main className="flex flex-col justify-center items-center h-full w-full">
        <div className="text-neutral-400 font-normal">
          <h1>{errorMessage}</h1>
        </div>
      </main>
    );
  }

  const academicYearSubject: AcademicYearSubject =
    await resAcademicYearSubject.json();

  const resSubject = await fetch(
    `http://localhost:8080/api/subject/${subjectName}`,
    {
      cache: "no-store",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    }
  );
  const subject: Subject = await resSubject.json();

  const resClassCoveragePlans = await fetch(
    `http://localhost:8080/api/class-coverage-plans/${academicYearName}/${subjectName}`,
    {
      cache: "no-store",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    }
  );
  const classCoveragePlans: ClassCoveragePlan[] =
    await resClassCoveragePlans.json();

  const unassignedClasses = calculateUnassignedClasses(
    classCoveragePlans,
    academicYearSubject.numberOfStudentGroups,
    subject
  );

  const resClassCoveragePlan = await fetch(
    `http://localhost:8080/api/class-coverage-plans/${id}`,
    {
      cache: "no-store",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    }
  );
  const classCoveragePlan: ClassCoveragePlan =
    await resClassCoveragePlan.json();

  const maxAssignedLectureClasses =
    classCoveragePlan.amountOfLectureClassesPerTeachingStaff +
    unassignedClasses.unassignedLectureClasses;
  const maxAssignedPracticalClasses =
    classCoveragePlan.amountOfPracticalClassesPerTeachingStaff +
    unassignedClasses.unassignedPracticalClasses;
  const maxAssignedLabPracticalClasses =
    classCoveragePlan.amountOfLabPracticalClassesPerTeachingStaff +
    unassignedClasses.unassignedLabPracticalClasses;

  return (
    <main className="flex flex-col justify-center items-center h-full w-full">
      <div>
        <h1>[{id}] Class coverage plan</h1>
        <ClassCoveragePlanDetailsForm
          classCoveragePlan={classCoveragePlan}
          maxAssignedLectureClasses={maxAssignedLectureClasses}
          maxAssignedPracticalClasses={maxAssignedPracticalClasses}
          maxAssignedLabPracticalClasses={maxAssignedLabPracticalClasses}
        />
      </div>
    </main>
  );
};

export default ClassCoveragePlanDetailsPage;
